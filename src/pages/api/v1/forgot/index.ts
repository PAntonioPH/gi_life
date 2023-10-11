import {NextApiRequest, NextApiResponse} from "next";
import {conn} from "@/utils/database";
import {message, validar_llaves} from "@/utils/functions";
import {v4 as uuid} from 'uuid';
import {replaceParamsValues, sendEmail} from "@/utils/mail";
import {messageRecoverPassword} from "@/data/mail/messageRecoverPassword";

const auth = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, body} = req

  let response

  switch (method) {
    case "POST":
      try {
        const keys_required = ["usernameEmail",]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

        const {usernameEmail,} = body

        response = await conn.query(`SELECT u.id, u.name, u.last_name, u.email, u.username, r.name AS rol
                                     FROM users as u
                                              JOIN roles r on r.id = u.id_rol
                                     WHERE u.active = true
                                       AND (u.username = '${usernameEmail}'
                                         OR u.email = '${usernameEmail}');`)

        if (response.rows.length === 0) return res.status(404).json(message("El usuario o correo no existe"))

        response = await conn.query(`UPDATE users
                                     SET code  = '${Math.floor(Math.random() * (99999 - 10000) + 10000)}',
                                         token = '${uuid()}'
                                     WHERE username = '${usernameEmail}'
                                        OR email = '${usernameEmail}'
                                     RETURNING *;`)

        const email = await sendEmail(response.rows[0].email, `Código de verificación de: ${response.rows[0].username}`, replaceParamsValues(messageRecoverPassword, ["code", "user"], [response.rows[0].code, response.rows[0].username]))

        if (!email.success) return res.status(500).json(message(email.message))

        return res.status(200).json(message("Usuario verificado", response.rows[0]))
      } catch (e) {
        console.log(e)
        return res.status(500).json(message("Error, al verificar el usuario"))
      }
    default:
      return res.status(400).json(message("Method not allowed"))
  }
}

export default auth