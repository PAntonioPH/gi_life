import {NextApiRequest, NextApiResponse} from "next";
import {filtrar_llaves, message, validar_llaves} from "@/utils/functions";
import {uploadFile} from "@/utils/s3";
import {conn} from "@/utils/database";
import {query_insert} from "@/utils/postgres";

const product = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, body} = req

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
                                            c.name as category
                                     FROM product AS p
                                              JOIN categories c on p.id_category = c.id
                                     WHERE p.active = true
                                     ORDER BY p.id DESC;`)

        if (response.rows.length > 0) {
          for (let i = 0; i < response.rows.length; i++) {
            let product = response.rows[i]
            product.images = JSON.parse(product.images)
          }
        }

        return res.status(200).json(message("Productos consultados", response.rows))
      } catch (e) {
        return res.status(500).json(message("Error, al consultar los productos"))
      }
    case "POST":
      try {
        const keys_required = ["name", "price", "discount", "stock", "description", "id_category"]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

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
        }

        const keys_filter = ["name", "price", "discount", "stock", "description", "images", "id_category"]
        response = await conn.query(query_insert(await filtrar_llaves(body, keys_filter), "product"))

        return res.status(200).json(message("Producto registrado",))
      } catch (e) {
        console.log(e)
        return res.status(500).json(message("Error, al registrar el producto"))
      }
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1gb',
    }
  }
}

export default product