import {NextApiRequest, NextApiResponse} from "next";
import {conn} from "@/utils/database";
import {query_update} from "@/utils/postgres";
import {filtrar_llaves, message, validar_llaves, validate_cookie} from "@/utils/functions";
import {uploadFile} from "@/utils/s3";
import {decodeHTML5, encodeHTML5} from "entities";

const posts = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, query, body} = req
  const {id} = query

  let response: any

  switch (method) {
    case "GET":
      try {
        response = await conn.query(`SELECT p.id,
                                            p.title,
                                            p.img,
                                            p.content,
                                            p.time_update,
                                            p.title_rrss, LEFT (cast (p.date_update AS varchar), 10) as date_update, c.id as id_category, pt.id as id_post_type, CONCAT(u.name, ' ', u.last_name) as author, u.photo as photo_author
                                     FROM posts p
                                         JOIN categories c
                                     ON p.id_category = c.id
                                         JOIN post_types pt on p.id_post_type = pt.id
                                         JOIN users u on p.id_user = u.id
                                     WHERE p.active = true
                                       AND p.id = '${id}';`)

        await conn.query(`UPDATE posts
                          SET visits = visits + 1
                          WHERE id = '${id}';`)

        if (response.rows.length === 0) return res.status(404).json(message("Post no encontrado"))

        response.rows[0].content = decodeHTML5(response.rows[0].content)

        return res.status(200).json(message("Post consultada", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al consultar la post"))
      }
    case "PUT":
      try {
        const {id: id_user} = await validate_cookie(req, "tokenAuth")
        if (id_user) body.id_user = id_user

        const keys_required = ["title", "content", "id_category", "id_post_type", "id_user", "title_rrss"]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

        const {fileName, file64} = body;

        delete body.img

        if (fileName && file64) {
          const result = await uploadFile(file64, fileName, "post")

          if (!result.success || !result.response) return res.status(500).json(message("Error, al subir el archivo"));
          body.img = result.response.url
        }

        body.content = encodeHTML5(body.content)

        const keys_filter = ["title", "content", "img", "id_category", "id_post_type", "id_user", "title_rrss"]
        response = await conn.query(query_update(await filtrar_llaves(body, keys_filter), {id}, "posts"))

        if (response.rows.length === 0) return res.status(404).json(message("Post no encontrado"))

        return res.status(200).json(message("Post actualizada", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al actualizar el post"))
      }
    case "DELETE":
      try {
        response = await conn.query(`UPDATE posts
                                     SET active = false
                                     WHERE id = '${id}'
                                     RETURNING *;`)

        if (response.rows.length === 0) return res.status(404).json(message("Post no encontrado"))

        return res.status(200).json(message("Post eliminada", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al eliminar la post"))
      }
    default:
      return res.status(400).json(message("Method not allowed"))
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1gb"
    }
  }
}

export default posts