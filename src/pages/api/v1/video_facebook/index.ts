import {NextApiRequest, NextApiResponse} from "next";
import {filtrar_llaves, message, validar_llaves} from "@/utils/functions";
import {conn} from "@/utils/database";
import {query_insert, query_update} from "@/utils/postgres";
import {decodeHTML5, encodeHTML5} from "entities";

const Video_facebook = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, body, query} = req

  let response

  switch (method) {
    case "GET":
      try {
        const {id} = query

        if (!id) return res.status(500).json(message("Error, el id es requerido"))

        response = await conn.query(`SELECT v.*
                                     FROM video_facebook v
                                     WHERE v.id = '${id}';`)

        if (response.rows.length > 0) response.rows[0].url = decodeHTML5(response.rows[0].url)

        return res.status(200).json(message("Video consultado", response.rows.length > 0 ? response.rows[0] : {
          url: "",
          title: ""
        }))
      } catch (e) {
        return res.status(500).json(message("Error, al consultar el eventos"))
      }
    case "POST":
      try {
        const keys_required = ["url", "title",  "id"]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

        const {id} = body

        const video = await conn.query(`SELECT v.*
                                        FROM video_facebook v
                                        WHERE v.id = '${id}';`)

        const keys_filter = ["url", "title", "id"]

        body.url = encodeHTML5(body.url)

        if (video.rows.length > 0) {
          response = await conn.query(query_update(await filtrar_llaves(body, keys_filter), {id}, "video_facebook"))
        } else {
          response = await conn.query(query_insert(await filtrar_llaves(body, keys_filter), "video_facebook"))
        }

        return res.status(200).json(message("Video registrado", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al actualizar el eventos"))
      }
    default:
      return res.status(400).json(message("Error, el tipo de evento no es valido"))
  }
}

export default Video_facebook;