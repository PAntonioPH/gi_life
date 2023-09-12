import {NextApiRequest, NextApiResponse} from "next";
import {get_fecha, message} from "@/utils/functions";
import {conn} from "@/utils/database";

const Visits = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, query} = req

  let response

  switch (method) {
    case "GET":
      try {
        const {today} = query

        if (today && today === "true") {
          response = await conn.query(`SELECT counter
                                       FROM visits
                                       WHERE date = '${get_fecha()}';`)
        } else {
          response = await conn.query(`SELECT *
                                       FROM visits
                                       ORDER BY date DESC;`)

          response.rows = response.rows.map((item: { date: Date }) => ({
            ...item,
            date: item.date.toISOString().split("T")[0]
          }))
        }

        return res.status(200).json(message("Visitas obtenidas", response.rows))
      } catch (e) {
        return res.status(500).json(message("Error, al obtener las visitas"))
      }
    case "POST":
      try {
        const date = await conn.query(`SELECT date
                                       FROM visits
                                       WHERE date = '${get_fecha()}';`)

        await conn.query(
          date.rows.length > 0
            ? `UPDATE visits
               SET counter = counter + 1
               WHERE date = '${get_fecha()}';`
            : `INSERT INTO visits (date, counter)
               VALUES ('${get_fecha()}', 1);`
        )

        return res.status(200).json(message("Visita registrada"))
      } catch (e) {
        return res.status(500).json(message("Error, al registrar la visita"))
      }
    default:
      return res.status(400).json(message("Method not allowed"))
  }
}

export default Visits