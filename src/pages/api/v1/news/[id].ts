import {NextApiRequest, NextApiResponse} from "next";
import {message} from "@/utils/functions";
import {conn} from "@/utils/database";
import moment from "moment";

const News = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, query} = req
  const {id} = query

  let response

  switch (method) {
    case 'GET':
      try {
        response = await conn.query(`SELECT id, url, cover_url, date_update, date, news_embed
                                     FROM news
                                     WHERE active = true
                                       AND id = ${id};`)

        if (response.rows.length === 0) return res.status(404).json(message("Periodico no encontrado"))

        response.rows[0].date = moment(response.rows[0].date).format("YYYY-MM-DD")

        return res.status(200).json(message("Periodico obtenido correctamente", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al obtener el periodico"))
      }
    case 'DELETE':
      try {
        response = await conn.query(`UPDATE news
                                     SET active = false
                                     WHERE id = ${id}
                                     RETURNING *;`)

        if (response.rows.length === 0) return res.status(404).json(message("Periodico no encontrado"))

        return res.status(200).json(message("Periodico eliminado correctamente", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al eliminar el periodico"))
      }
    default:
      return res.status(400).json(message("Method not allowed"));
  }
}

export default News