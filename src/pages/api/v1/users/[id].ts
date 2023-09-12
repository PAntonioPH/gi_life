import {NextApiRequest, NextApiResponse} from "next";
import {conn} from "@/utils/database";
import {query_update} from "@/utils/postgres";
import {filtrar_llaves, message, validar_llaves} from "@/utils/functions";

const users = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, query, body} = req
  const {id} = query

  let response: any

  switch (method) {
    case "GET":
      try {
        response = await conn.query(`SELECT u.id, u.name, u.last_name, u.email, u.username, r.id AS id_rol, r.name AS name_rol
                                     FROM users as u
                                              JOIN roles r on r.id = u.id_rol
                                     WHERE u.active = true
                                       AND u.id = ${id}
                                     ORDER BY u.id;`)

        if (response.rows.length === 0) return res.status(404).json(message("Usuario no encontrado"))

        return res.status(200).json(message("Usuario consultado", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al consultar el usuario"))
      }
    case "PUT":
      try {
        const keys_required = ["username", "name", "last_name", "email", "id_rol",]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

        response = await conn.query(`SELECT username
                                     FROM users
                                     WHERE username = '${body.username}'
                                       AND id != '${id}';`)

        if (response.rows.length > 0) return res.status(500).json(message("El usuario ya existe"))

        const keys_filter = ["username", "name", "last_name", "email", "id_rol", "password"]
        response = await conn.query(query_update(await filtrar_llaves(body, keys_filter), {id}, "users"))

        if (response.rows.length === 0) return res.status(404).json(message("Usuario no encontrado"))

        return res.status(200).json(message("Usuario actualizado", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al actualizar el usuario"))
      }
    case "DELETE":
      try {
        response = await conn.query(`UPDATE users
                                     SET active = false
                                     WHERE id = '${id}'
                                     RETURNING *;`)

        if (response.rows.length === 0) return res.status(404).json(message("Usuario no encontrado"))

        return res.status(200).json(message("Usuario eliminado", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al eliminar el usuario"))
      }
    default:
      return res.status(400).json(message("Method not allowed"))
  }
}

export default users