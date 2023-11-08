import {NextApiRequest, NextApiResponse} from "next";
import {filtrar_llaves, message, validar_llaves, validate_cookie} from "@/utils/functions";
import {conn} from "@/utils/database";
import {query_update} from "@/utils/postgres";

const user_address = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, query, body} = req

  let response: any

  switch (method) {
    case "GET":
      try {
        const {id} = await validate_cookie(req, "tokenAuth")

        if (!id) return res.status(500).json(message("Error, no se recibió el id del usuario"))

        response = await conn.query(`SELECT id,
                                            id_user,
                                            country,
                                            street,
                                            neighborhood,
                                            postal_code,
                                            state,
                                            municipality
                                     FROM user_address
                                     WHERE id_user = '${id}';`)

        if (response.rows.length === 0) return res.status(404).json(message("Dirección no encontrada"))

        return res.status(200).json(message("Dirección obtenida", response.rows[0]))
      } catch (e) {
        console.log(e)
        return res.status(500).json(message("Error, al consultar la dirección"))
      }
    case "PUT":
      try {
        const {id} = await validate_cookie(req, "tokenAuth")
        body.id_user = id

        const keys_required = ["id_user", "country", "street", "neighborhood", "postal_code", "state", "municipality"]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

        const keys_filter = ["country", "street", "neighborhood", "postal_code", "state", "municipality"]
        response = await conn.query(query_update(await filtrar_llaves(body, keys_filter), {id}, "user_address"))

        if (response.rows.length === 0) return res.status(404).json(message("Dirección no encontrada"))

        return res.status(200).json(message("Dirección actualizada", response.rows[0]))
      } catch (e) {
        console.log(e)
        return res.status(500).json(message("Error, al actualizar la dirección"))
      }
    default:
      return res.status(405).json(message("Method not allowed"))
  }
}

export default user_address;