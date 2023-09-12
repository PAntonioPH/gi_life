import {NextApiRequest, NextApiResponse} from "next";
import {conn} from "@/utils/database";
import * as process from "process";
import {serialize} from "cookie";
import {sign} from "jsonwebtoken";
import {message, validar_llaves, validate_login} from "@/utils/functions";

const {NEXT_PUBLIC_ENV, NEXT_PUBLIC_SECRET} = process.env

const auth = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, body} = req

  let response

  switch (method) {
    case "GET":
      try {
        const {tokenAuth} = req.cookies;

        if (!tokenAuth) return res.status(401).json(message("Error, no hay sesión"));

        const serialized = serialize("tokenAuth", "", {
          httpOnly: true,
          secure: NEXT_PUBLIC_ENV === "production",
          sameSite: "strict",
          maxAge: 0,
          path: "/",
        });

        res.setHeader("Set-Cookie", serialized);

        return res.status(200).json(message("Cierre de sesión exitoso"))
      } catch (e) {
        return res.status(500).json(message("Error, al cerrar sesión"))
      }
    case "POST":
      try {
        const keys_required = ["username", "password"]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

        const {username, password} = body

        response = await conn.query(`Select username, id, id_rol
                                     From users
                                     Where username = '${validate_login(username)}'
                                       AND PGP_SYM_DECRYPT(password::bytea, 'AES_KEY') = '${validate_login(password)}'
                                       And active = true;`)

        if (response.rows.length > 0 && response.rows[0].username === username && NEXT_PUBLIC_SECRET) {
          const {username, id, id_rol} = response.rows[0]

          const token = sign(
            {
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
              username,
              id,
              id_rol,
            },
            NEXT_PUBLIC_SECRET
          );

          const serialized = serialize("tokenAuth", token, {
            httpOnly: true,
            secure: NEXT_PUBLIC_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: "/",
          });

          res.setHeader("Set-Cookie", serialized);

          return res.status(200).json(message("Inicio de sesión exitoso", {token, username, id, id_rol}))
        }

        return res.status(401).json(message("Usuario o contraseña no valido"))
      } catch (e) {
        return res.status(500).json(message("Error, al iniciar sesión"))
      }
    default:
      return res.status(400).json(message("Method not allowed"))
  }
}

export default auth