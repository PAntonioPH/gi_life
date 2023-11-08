import {NextApiRequest, NextApiResponse} from "next";
import {filtrar_llaves, message, validar_llaves, validate_cookie} from "@/utils/functions";
import {conn} from "@/utils/database";
import {query_insert} from "@/utils/postgres";
import moment from "moment";

const purchase = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, body, query} = req

  let response: any

  switch (method) {
    case "GET":
      try {
        const {time_zone, shopping} = query
        const {id: id_user} = await validate_cookie(req, "tokenAuth")

        if (!time_zone) return res.status(500).json(message("Error, no se recibió la zona horaria"))

        response = await conn.query(`SELECT p.id, p.id_user, p.total, p.date_update, p.time_update, ps.name as status, u.username
                                     FROM purchase p
                                              INNER JOIN users u on p.id_user = u.id
                                              INNER JOIN purchase_status ps on p.id_purchase_status = ps.id
                                         ${shopping ? `WHERE p.id_user = '${id_user}'` : ""}
                                     ORDER BY p.id DESC;`)

        if (response.rows.length > 0) {
          response.rows.forEach((purchase: any) => purchase.total = parseFloat(purchase.total))
          response.rows.forEach((purchase: any) => purchase.date_time_update = moment.utc(`${moment(purchase.date_update).format("YYYY-MM-DD")} ${purchase.time_update}`).tz(time_zone as string).format("LL, h:mm a"))
        }

        return res.status(200).json(message("Compras obtenidas", response.rows))
      } catch (e) {
        console.log(e)
        return res.status(500).json(message("Error, no se pudieron obtener las compras"))
      }
    case "POST":
      try {
        const {id: id_user} = await validate_cookie(req, "tokenAuth")
        if (id_user) body.id_user = id_user

        const keys_required = ["id_user", "cart", "time_zone", "id_purchase_stripe"]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

        const {cart} = body

        const responseCart = await conn.query(`SELECT id, price, discount
                                               FROM product
                                               WHERE id IN (${cart.map((item: any) => `'${item.id}'`).join(",")});`)

        responseCart.rows.forEach((item: any) => item.quantity = cart.find((cartItem: any) => cartItem.id === item.id).count)

        body.total = responseCart.rows.reduce((a: any, b: any) => a + (b.price * b.quantity) * (1 - b.discount / 100), 0);
        body.id_purchase_status = 1
        body.purchase = JSON.stringify(body.cart)

        const keys_filter = ["id_user", "purchase", "total", "time_zone", "id_purchase_status", "id_purchase_stripe"]

        response = await conn.query(query_insert(await filtrar_llaves(body, keys_filter), "purchase", true))

        return res.status(200).json(message("Compra realizada", response.rows[0]))
      } catch (e) {
        console.log(e)
        return res.status(500).json(message("Error, no se pudo realizar la compra"))
      }
    default:
      return res.status(405).json(message("Error, método no permitido"))
  }
}

export default purchase