import {NextApiRequest, NextApiResponse} from "next";
import {message} from "@/utils/functions";
import {conn} from "@/utils/database";

const Last_posts = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, query} = req

  let response

  switch (method) {
    case 'GET':
      try {
        const {actualPost} = query

        if (!actualPost) return res.status(400).json(message("Error, no se ha enviado el id del post actual"))

        response = await conn.query(`SELECT p.id,
                                            p.title,
                                            p.img,
                                            c.url  as category,
                                            c.name as category_name
                                     FROM posts p
                                              JOIN categories c on p.id_category = c.id
                                     WHERE p.active = true
                                       AND p.id_post_type = 1
                                       AND p.id != ${actualPost}
                                     ORDER BY p.date_update DESC
                                     LIMIT 8;`)

        return res.status(200).json(message("Últimos posts obtenidos correctamente", response.rows))
      } catch (e) {
        return res.status(500).json(message("Error, al obtener los últimos posts"))
      }
    default:
      return res.status(400).json(message("Method not allowed"))
  }
}

export default Last_posts