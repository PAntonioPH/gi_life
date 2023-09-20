import {NextApiRequest, NextApiResponse} from "next";
import {filtrar_llaves, message, validar_llaves} from "@/utils/functions";
import {conn} from "@/utils/database";
import {uploadFile} from "@/utils/s3";
import {query_update} from "@/utils/postgres";

const product = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, body, query} = req
  const {id} = query

  let response: any

  switch (method) {
    case "GET":
      try {
        response = await conn.query(`SELECT p.id,
                                            p.name,
                                            p.price,
                                            p.discount,
                                            p.stock,
                                            p.description,
                                            p.images,
                                            p.id_category,
                                            c.name as category
                                     FROM product AS p
                                              JOIN categories c on p.id_category = c.id
                                     WHERE p.active = true
                                     ORDER BY p.id DESC;`)

        if (response.rows.length <= 0) return res.status(404).json(message("Producto no encontrado"))

        for (let i = 0; i < response.rows.length; i++) {
          let product = response.rows[i]
          product.images = JSON.parse(product.images)
        }
        return res.status(200).json(message("Producto consultado", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al consultar el producto"))
      }
    case "PUT":
      try {
        const keys_required = ["name", "price", "discount", "stock", "description", "id_category"]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

        delete body.images
        let tempImages: string[] = []

        if (body.files.length > 0) {
          for (let i = 0; i < body.files.length; i++) {
            const {fileName, file64} = body.files[i];

            if (fileName && file64) {
              const result = await uploadFile(file64, fileName, "product")
              if (!result.success || !result.response) return res.status(500).json(message("Error, al subir el archivo"));
              tempImages = [...tempImages, result.response.url]
            }
          }

          body.images = JSON.stringify(tempImages)
        } else {
          body.images = JSON.stringify([])
        }

        const keys_filter = ["name", "price", "discount", "stock", "description", "images", "id_category"]
        response = await conn.query(query_update(await filtrar_llaves(body, keys_filter), {id}, "product"))

        if (response.rows.length <= 0) return res.status(404).json(message("Producto no encontrado"))

        return res.status(200).json(message("Producto actualizado", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al actualizar el producto"))
      }
    case "DELETE":
      try {
        response = await conn.query(`UPDATE product
                                     SET active = false
                                     WHERE id = '${id}'
                                     RETURNING *;`)

        if (response.rows.length <= 0) return res.status(404).json(message("Producto no encontrado"))

        return res.status(200).json(message("Producto eliminado", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al eliminar el producto"))
      }
    default:
      return res.status(405).json(message("Error, método no permitido"))
  }
}

export default product