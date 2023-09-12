import {NextApiRequest, NextApiResponse} from "next";
import {conn} from "@/utils/database";
import {query_insert} from "@/utils/postgres";
import {filtrar_llaves, message, validar_llaves} from "@/utils/functions";

const users = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, body} = req

  let response

  switch (method) {
    case "GET":
      try {
        response = await conn.query("SELECT u.id, CONCAT(u.name, ' ', u.last_name) AS name, u.email, u.username, r.name AS rol FROM users as u JOIN roles r on r.id = u.id_rol WHERE u.active = true ORDER BY u.id;")

        return res.status(200).json(message("Usuarios consultados", response.rows))
      } catch (e) {
        return res.status(500).json(message("Error, al consultar los usuarios"))
      }
    case "POST":
      try {
        const keys_required = ["username", "name", "last_name", "email", "id_rol", "password"]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

        response = await conn.query(`SELECT username
                                     FROM users
                                     WHERE username = '${body.username}';`)

        if (response.rows.length > 0) return res.status(500).json(message("El usuario ya existe"))

        const keys_filter = ["username", "name", "last_name", "email", "id_rol", "password"]
        response = await conn.query(query_insert(await filtrar_llaves(body, keys_filter), "users"))

        return res.status(200).json(message("Usuario registrado", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al registrar el usuario"))
      }
    default:
      return res.status(400).json(message("Method not allowed"))
  }
}

export default users