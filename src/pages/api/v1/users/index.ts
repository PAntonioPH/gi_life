import {NextApiRequest, NextApiResponse} from "next";
import {conn} from "@/utils/database";
import {query_insert} from "@/utils/postgres";
import {filtrar_llaves, message, validar_llaves, validate_cookie} from "@/utils/functions";
import {replaceParamsValues, sendEmail} from "@/utils/mail";
import {v4 as uuid} from 'uuid';
import {messageNewAccount} from "@/data/mail/messageNewAccount";

const users = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, body} = req

  let response

  switch (method) {
    case "GET":
      try {
        response = await conn.query(`SELECT u.id, CONCAT(u.name, ' ', u.last_name) AS name, u.email, u.username, r.name AS rol
                                     FROM users as u
                                              JOIN roles r on r.id = u.id_rol
                                     WHERE u.active = true
                                     ORDER BY u.id;`)

        return res.status(200).json(message("Usuarios consultados", response.rows))
      } catch (e) {
        return res.status(500).json(message("Error, al consultar los usuarios"))
      }
    case "POST":
      try {
        const keys_required = ["username", "name", "last_name", "email", "password", "phone"]
        const validation = await validar_llaves(keys_required, body)

        const {id_rol} = await validate_cookie(req, "tokenAuth")

        const {email: emailTo, username} = body

        if (!id_rol) {
          body.id_rol = 3
          body.verified = false
          body.code = Math.floor(Math.random() * (99999 - 10000) + 10000)
          body.token = uuid()

          const email = await sendEmail(emailTo, `Código de verificación de: ${username}`, replaceParamsValues(messageNewAccount, ["code", "user"], [body.code, username]))

          if (!email.success) return res.status(500).json(message(email.message))
        }

        if (!validation.success) return res.status(500).json(message(validation.message))

        response = await conn.query(`SELECT username, email
                                     FROM users
                                     WHERE username = '${body.username}'
                                        OR email = '${body.email}';`)

        if (response.rows.length > 0) {
          if (response.rows[0].username === body.username) return res.status(500).json(message("El nombre de usuario ya existe"))
          if (response.rows[0].email === body.email) return res.status(500).json(message("El correo ya existe"))
        }

        const keys_filter = ["username", "name", "last_name", "email", "id_rol", "password", "code", "verified", "token", "phone"]
        response = await conn.query(query_insert(await filtrar_llaves(body, keys_filter), "users"))

        return res.status(200).json(message("Usuario registrado", response.rows[0]))
      } catch (e) {
        console.log(e)
        return res.status(500).json(message("Error, al registrar el usuario"))
      }
    default:
      return res.status(400).json(message("Method not allowed"))
  }
}

export default users