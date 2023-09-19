import {NextApiRequest, NextApiResponse} from "next";
import {filtrar_llaves, message, validar_llaves} from "@/utils/functions";
import {conn} from "@/utils/database";
import {uploadFile} from "@/utils/s3";
import {query_insert, query_update} from "@/utils/postgres";

const banner = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, query, body} = req
  const {id} = query

  let response: any

  switch (method) {
    case "GET":
      try {
        response = await conn.query(`SELECT id, title, img
                                     FROM banner
                                     WHERE active = true
                                       AND id = '${id}';`)

        if (response.rows.length === 0) return res.status(404).json(message("Banner no encontrado"))

        return res.status(200).json(message("Banner consultado", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al consultar el banner"))
      }
    case "PUT":
      try {
        const keys_required = ["title"]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

        const {fileName, file64} = body;

        delete body.img

        if (fileName && file64) {
          const result = await uploadFile(file64, fileName, "banner")
          if (!result.success || !result.response) return res.status(500).json(message("Error, al subir el archivo"));
          body.img = result.response.url
        }

        const keys_filter = ["title", "img"]
        response = await conn.query(query_update(await filtrar_llaves(body, keys_filter), {id}, "banner"))

        if (response.rows.length === 0) return res.status(404).json(message("Banner no encontrado"))

        return res.status(200).json(message("Banner actualizado", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al actualizar el banner"))
      }
    case "DELETE":
      try {
        response = await conn.query(`UPDATE banner
                                     SET active = false
                                     WHERE id = '${id}'
                                     RETURNING *;`)

        if (response.rows.length === 0) return res.status(404).json(message("Banner no encontrado"))

        return res.status(200).json(message("Banner eliminado", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al eliminar el banner"))
      }
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    }
  }
}

export default banner