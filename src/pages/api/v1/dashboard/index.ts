import {NextApiRequest, NextApiResponse} from "next";
import {message} from "@/utils/functions";
import moment from "moment";
import {conn} from "@/utils/database";
import {Dashboard} from "@/interfaces/Dashboard";

const Dashboard = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, body} = req

  let response: Dashboard = {
    visitsDay: [],
    pageViews: [],
    startDashboard: "",
  }

  switch (method) {
    case 'POST':
      try {
        const {dateStart, dateEnd} = body;

        if (dateStart && dateEnd && new Date(dateStart) > new Date(dateEnd)) return res.status(500).json(message("Error, la fecha de inicio no puede ser mayor a la fecha de fin"));

        const visits = await conn.query(`SELECT date, counter
                                         FROM visits ${dateStart && dateEnd ? `WHERE date BETWEEN '${dateStart}' AND '${dateEnd}'` : ``}
                                         ORDER BY date DESC;`)

        let date = dateStart && dateEnd ? new Date(dateEnd) : new Date();
        let limit = dateStart && dateEnd ? moment(dateEnd).diff(moment(dateStart), 'days') + 1 : 7;

        date.setDate(date.getDate() - (limit - (dateStart && dateEnd ? 2 : 1)));

        const minDate = await conn.query(`SELECT date
                                          FROM visits
                                          ORDER BY date
                                          LIMIT 1;`)

        response.startDashboard = minDate.rows && minDate.rows.length > 0 ? minDate.rows[minDate.rows.length - 1].date : moment().format('YYYY-MM-DD');

        for (let i = 0; i < limit; i++) {
          const dateVisit = moment(date).format('YYYY-MM-DD')
          date.setDate(date.getDate() + 1);

          const visitsDate = visits.rows.find((item: any) => moment(item.date).format('YYYY-MM-DD') === dateVisit)

          response.visitsDay = [
            ...response.visitsDay,
            {
              visits: visitsDate ? visitsDate.counter : 0,
              date: dateVisit
            }
          ]
        }

        const pageViews = await conn.query(`SELECT id, title, visits
                                            FROM posts
                                            WHERE active = true
                                            ORDER BY visits DESC
                                            LIMIT 5;`)

        response.pageViews = pageViews.rows.map((item: any) => ({title: item.title, views: item.visits}))

        return res.status(200).json(message('Dashboard consultado', response))
      } catch (e) {
        return res.status(500).json(message('Error, al consultar el dashboard'))
      }
    default:
      return res.status(400).json(message("Method not allowed"));
  }
}

export default Dashboard