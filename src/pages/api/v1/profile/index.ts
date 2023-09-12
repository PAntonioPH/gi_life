import jwt, {JwtPayload} from "jsonwebtoken";
import {NextApiRequest, NextApiResponse} from "next";
import process from "process";
import {conn} from "@/utils/database";
import {serialize} from "cookie";
import {message, validar_llaves, validate_login} from "@/utils/functions";

const {NEXT_PUBLIC_SECRET, NEXT_PUBLIC_ENV} = process.env

const profile = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, body} = req;

  let response, session;

  switch (method) {
    case "GET":
      const {tokenAuth} = req.cookies;

      if (!tokenAuth || !NEXT_PUBLIC_SECRET) return res.status(401).json(message("Error, no hay sesión"));

      const {username, id, id_rol} = jwt.verify(tokenAuth, NEXT_PUBLIC_SECRET) as JwtPayload;

      response = await conn.query(`Select username, id, id_rol
                                   From users
                                   Where username = '${validate_login(username)}'
                                     And id = '${id}'
                                     And id_rol = '${id_rol}'
                                     And active = true;`)

      if (response.rows.length <= 0) {
        const serialized = serialize("tokenAuth", "", {
          httpOnly: true,
          secure: NEXT_PUBLIC_ENV === "production",
          sameSite: "strict",
          maxAge: 0,
          path: "/",
        });

        res.setHeader("Set-Cookie", serialized);

        return res.status(401).json(message("Error, Usuario no consultado"));
      }

      return res.status(200).json(message("Usuario consultado", {username, id, id_rol,}));
    case "POST":
      const keys_required = ["token"]
      const validation = await validar_llaves(keys_required, body)

      if (!validation.success || !NEXT_PUBLIC_SECRET) return res.status(500).json(message(validation.message))

      const {token} = body

      try {
        session = jwt.verify(token, NEXT_PUBLIC_SECRET) as JwtPayload;

        response = await conn.query(`Select username, id, id_rol
                                     From users
                                     Where username = '${validate_login(session.username)}'
                                       And id = '${session.id}'
                                       And id_rol = '${session.id_rol}'
                                       And active = true;`)

        if (response.rows.length <= 0) return res.status(401).json(message("Error, usuario no consultado"));

        return res.status(200).json(message("Usuario consultado", {token, username: session.username, id: session.id, id_rol: session.id_rol,}));
      } catch (error) {
        return res.status(401).json(message("Error, no hay sesión"));
      }
    default:
      return res.status(400).json(message("Method not allowed"))
  }
};

export default profile;