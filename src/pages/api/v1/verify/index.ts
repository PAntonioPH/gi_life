import {NextApiRequest, NextApiResponse} from "next";
import {conn} from "@/utils/database";
import {message, validar_llaves} from "@/utils/functions";
import {replaceParamsValues, sendEmail} from "@/utils/mail";
import {messageNewAccount} from "@/data/mail/messageNewAccount";
import {messageRecoverPassword} from "@/data/mail/messageRecoverPassword";
import {messageWelcome} from "@/data/mail/messageWelcome";

const auth = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, body} = req

  let response

  switch (method) {
    case "POST":
      try {
        const keys_required = ["code", "token",]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

        const {code, token, password} = body

        if (password) {
          response = await conn.query(`UPDATE users
                                       SET password = PGP_SYM_ENCRYPT('${password}', 'AES_KEY')
                                       WHERE code = '${code}'
                                         AND token = '${token}'
                                       RETURNING *;`)

          if (response.rows.length === 0) return res.status(404).json(message("El usuario no existe o token incorrecto"))

          return res.status(200).json(message("Contraseña actualizada", response.rows[0]))
        } else {
          response = await conn.query(`UPDATE users
                                       SET verified = true
                                       WHERE code = '${code}'
                                         AND token = '${token}'
                                       RETURNING *;`)

          if (response.rows.length === 0) return res.status(404).json(message("El usuario no existe o token incorrecto"))

          const email = await sendEmail(response.rows[0].email, `Bienvenido: ${response.rows[0].username}`, replaceParamsValues(messageWelcome, ["user"], [response.rows[0].username]))

          if (!email.success) return res.status(500).json(message(email.message))

          return res.status(200).json(message("Usuario verificado", response.rows[0]))
        }
      } catch (e) {
        return res.status(500).json(message("Error, al verificar el usuario"))
      }
    default:
      return res.status(400).json(message("Method not allowed"))
  }
}

export default auth