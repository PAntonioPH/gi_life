import {NextApiRequest, NextApiResponse} from "next";
import {conn} from "@/utils/database";
import {query_insert} from "@/utils/postgres";
import {filtrar_llaves, message, validar_llaves, validate_cookie} from "@/utils/functions";
import {uploadFile} from "@/utils/s3";
import {postTwitter} from "@/utils/twitter";
import {postFacebook} from "@/utils/facebook";
import {encodeHTML5} from "entities";

const posts = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, body, query} = req

  let response: any

  switch (method) {
    case "GET":
      try {
        const {category, post_type, page} = query

        if (category && post_type) {
          if (typeof page !== "string" || !parseInt(page)) return res.status(500).json(message("Error, el parámetro page es requerido"))

          const responsePosts = await conn.query(`SELECT p.*
                                                  FROM (SELECT CEIL(ROW_NUMBER() OVER (ORDER BY p.id DESC) / 13) AS grupo,
                                                               p.*
                                                        FROM posts AS p
                                                                 JOIN categories c on c.id = p.id_category
                                                        WHERE p.active = true
                                                            ${typeof category === "string" && parseInt(category) && category !== "0" ? ` AND c.url = '${category}' ` : `  AND c.url = '${category}' `} ${typeof post_type === "string" && post_type !== "0" ? ` AND p.id_post_type = '${post_type}' ` : ""}) as p
                                                  WHERE p.grupo = ${parseInt(page) - 1};`)

          if (responsePosts.rows.length > 0) responsePosts.rows.forEach((post: any) => delete post.grupo)

          const responseCount = await conn.query(`SELECT COUNT(p.id) as count
                                                  FROM posts AS p
                                                           JOIN categories c on c.id = p.id_category
                                                  WHERE p.active = true
                                                    AND c.url = '${category}'
                                                    AND p.id_post_type = '1';`)

          response = {
            posts: responsePosts.rows,
            total: Math.ceil(responseCount.rows[0].count / 13),
            currentPage: parseInt(page)
          }

          return res.status(200).json(message("Posts consultados", response))
        } else {
          response = await conn.query(`SELECT p.id, p.title, p.date_update, p.time_update, c.name as category
                                       FROM posts AS p
                                                JOIN categories c on p.id_category = c.id
                                       WHERE p.active = true
                                       ORDER BY p.id DESC;`)

          if (response.rows.length > 0) {
            for (let i = 0; i < response.rows.length; i++) {
              let post = response.rows[i]
              post.date_update = post.date_update.toISOString().split("T")[0]
            }
          }

          return res.status(200).json(message("Posts consultados", response.rows))
        }
      } catch (e) {
        console.log(e)
        return res.status(500).json(message("Error, al consultar los posts"))
      }
    case "POST":
      try {
        const {id: id_user} = await validate_cookie(req, "tokenAuth")
        if (id_user) body.id_user = id_user

        const keys_required = ["title", "content", "id_category", "id_post_type", "id_user", "title_rrss"]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

        const {fileName, file64} = body;

        if (fileName && file64) {
          const result = await uploadFile(file64, fileName, "post")
          if (!result.success || !result.response) return res.status(500).json(message("Error, al subir el archivo"));
          body.img = result.response.url
        }

        body.content = encodeHTML5(body.content)

        body.title = body.title.replaceAll(/'/g, "\"")

        const keys_filter = ["title", "content", "img", "id_category", "id_post_type", "id_user", "title_rrss"]
        response = await conn.query(query_insert(await filtrar_llaves(body, keys_filter), "posts"))

        const category = await conn.query(`SELECT *
                                           FROM categories
                                           WHERE id = '${body.id_category}';`)

        const link = `https://laopiniondelaltiplano.com/category/${category.rows[0].url}/post/${response.rows[0].id}`

        try {
          await postTwitter(body.title_rrss, link)
        } catch (e) {
          console.log(e)
        }

        try {
          await postFacebook(body.title_rrss, link)
        } catch (e) {
          console.log(e)
        }

        return res.status(200).json(message("Post registrado", response.rows[0]))
      } catch (e) {
        console.log(e)
        return res.status(500).json(message("Error, al registrar el post"))
      }
    default:
      return res.status(400).json(message("Method not allowed"))
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1gb"
    }
  }
}

export default posts