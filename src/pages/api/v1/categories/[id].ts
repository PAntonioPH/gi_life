import {NextApiRequest, NextApiResponse} from "next";
import {conn} from "@/utils/database";
import {filtrar_llaves, message, validar_llaves} from "@/utils/functions";
import {query_insert, query_update} from "@/utils/postgres";
import {v4 as uuid} from "uuid";

const categories = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, query, body} = req
  const {id} = query

  let response: any

  switch (method) {
    case "GET":
      try {
        response = await conn.query(`SELECT *
                                     FROM categories
                                     WHERE active = true
                                       AND id = ${id};`)

        if (response.rows.length === 0) return res.status(404).json(message("Categoría no encontrada"))

        return res.status(200).json(message("Categoría consultada", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al consultar la categoría"))
      }
    case "PUT":
      try {
        const keys_required = ["name"]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

        const responseCategory = await conn.query(`SELECT url, active
                                                   FROM categories
                                                   WHERE url = '${body.url}';`)

        if (body.url !== responseCategory.rows[0].url && responseCategory.rows.length > 0 && responseCategory.rows[0].active) return res.status(500).json(message("Error, la url ya existe"))

        const keys_filter = ["name", "father", "url"]
        if (body.father === "") body.father = "data_null"

        try {
          response = await conn.query(query_update(await filtrar_llaves(body, keys_filter), {id}, "categories"))
        } catch (e) {
          body.url = `${body.url}-${uuid().split("-")[0]}`
          response = await conn.query(query_insert(await filtrar_llaves(body, keys_filter), "categories"))
        }

        if (response.rows.length === 0) return res.status(404).json(message("Categoría no encontrada"))

        return res.status(200).json(message("Categoría actualizada", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al actualizar la categoría"))
      }
    case "DELETE":
      try {
        response = await conn.query(`UPDATE categories
                                     SET active = false
                                     WHERE id = '${id}' RETURNING *;`)

        if (response.rows.length === 0) return res.status(404).json(message("Categoría no encontrada"))

        return res.status(200).json(message("Categoría eliminada", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al eliminar la categoría"))
      }
    default:
      return res.status(400).json(message("Method not allowed"))
  }
}

export default categories