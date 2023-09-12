import {NextApiRequest, NextApiResponse} from "next";
import {conn} from "@/utils/database";
import {message} from "@/utils/functions";

const Home = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method} = req;

  let response: any = {};

  switch (method) {
    case "GET":
      try {
        const consultaResponse = [
          {
            name: "estado",
            categories: [1],
            limit: 1
          },
          {
            name: "altiplano",
            categories: [16],
            limit: 3
          },
          {
            name: "nacional",
            categories: [4],
            limit: 10
          },
          {
            name: "internacional",
            categories: [5],
            limit: 10
          },
          {
            name: "deporte",
            categories: [2],
            limit: 10
          },
          {
            name: "espectaculo",
            categories: [3],
            limit: 1
          },
          {
            name: "municipios",
            categories: [6],
            limit: 3
          },
          {
            name: "circePolitico",
            categories: [26],
            limit: 1
          },
          {
            name: "EstratagemaInversa",
            categories: [27],
            limit: 1
          }
        ]

        for (let i = 0; i < consultaResponse.length; i++) {
          const {name, categories, limit} = consultaResponse[i];
          let where = ""
          categories.forEach((category, index) => where += ` c.id = ${category} OR c.father = ${category} ${index < categories.length - 1 ? "OR" : ""} `)

          const categoryResponse = await conn.query(`SELECT p.id,
                                                            p.title,
                                                            p.img,
                                                            c.url  as category,
                                                            c.name as category_name
                                                     FROM posts p
                                                              JOIN categories c on p.id_category = c.id
                                                     WHERE p.active = true
                                                       AND p.id_post_type = 1
                                                       AND (${where})
                                                     ORDER BY p.id DESC
                                                     LIMIT ${limit};`)

          response[name] = categoryResponse.rows
        }

        const mostReadResponse = await conn.query(`SELECT p.id,
                                                          p.title,
                                                          p.img,
                                                          c.url  as category,
                                                          c.name as category_name
                                                   FROM posts p
                                                            JOIN categories c on p.id_category = c.id
                                                   WHERE p.active = true
                                                   ORDER BY p.visits DESC
                                                   LIMIT 5;`)

        response.mostRead = mostReadResponse.rows

        return res.status(200).json(message("Home consultado", response));
      } catch (e) {
        return res.status(500).json(message("Error, al consultar el home"));
      }
    default:
      return res.status(400).json(message("Method not allowed"));
  }
}

export default Home;