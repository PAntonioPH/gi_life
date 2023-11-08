import {NextApiRequest, NextApiResponse} from "next";
import {message} from "@/utils/functions";
import {conn} from "@/utils/database";
import moment from "moment";

const purchase = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, query, body} = req
  const {id} = query

  let response: any

  switch (method) {
    case "GET":
      try {
        const {time_zone} = query
        if (!time_zone) return res.status(500).json(message("Error, no se recibió la zona horaria"))

        response = await conn.query(`SELECT p.id,
                                            p.id_user,
                                            p.total,
                                            p.date_update,
                                            p.time_update,
                                            ps.name as status,
                                            u.username,
                                            p.id_purchase_stripe,
                                            p.purchase
                                     FROM purchase p
                                              INNER JOIN users u on p.id_user = u.id
                                              INNER JOIN purchase_status ps on p.id_purchase_status = ps.id
                                     WHERE p.id = '${id}';`)

        if (response.rows.length === 0) return res.status(404).json(message("Compra no encontrada"))

        response.rows[0].purchase = JSON.parse(response.rows[0].purchase)
        response.rows[0].total = parseFloat(response.rows[0].total)
        response.rows[0].date_time_update = moment.utc(`${moment(response.rows[0].date_update).format("YYYY-MM-DD")} ${response.rows[0].time_update}`).tz(time_zone as string).format("LL, h:mm a")

        return res.status(200).json(message("Compra obtenida", response.rows[0]))
      } catch (e) {
        console.log(e)
        return res.status(500).json(message("Error, al consultar la compra"))
      }
    default:
      return res.status(405).json(message("Method not allowed"))
  }
}

export default purchase;