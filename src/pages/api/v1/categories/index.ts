import {NextApiRequest, NextApiResponse} from "next";
import {v4 as uuid} from 'uuid';
import {conn} from "@/utils/database";
import {Category} from "@/interfaces/Category";
import {query_insert} from "@/utils/postgres";
import {filtrar_llaves, message, validar_llaves} from "@/utils/functions";

const categories = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, body, query} = req
  const {navbar, father} = query

  let response

  switch (method) {
    case "GET":
      try {
        if (father && father !== "") {
          if (father === "true") {
            response = await conn.query("SELECT * FROM categories WHERE active = true AND father IS NULL;")

            return res.status(200).json(message("Categorías consultadas", response.rows))
          } else {
            response = await conn.query(`SELECT *
                                         FROM categories
                                         WHERE active = true
                                           AND id != '${father}' AND father IS NULL;`)

            return res.status(200).json(message("Categorías consultadas", response.rows))
          }
        }

        response = await conn.query("SELECT c.*, cf.name as father_name FROM categories as c LEFT JOIN categories as cf on c.father = cf.id WHERE c.active = true ORDER BY c.id;")

        if (navbar && navbar === "true") {
          let categories = response.rows.filter(({father}: Category) => father === null)
          let subCategories = response.rows.filter(({father}: Category) => father !== null)

          categories.forEach((subCategory: Category) => {
            const {id} = subCategory

            let filterCategory = subCategories.filter(({father}: Category) => father === id)

            if (!subCategory.children) subCategory.children = []
            subCategory.children = filterCategory

          })

          return res.status(200).json(message("Categorías consultadas", categories))
        }

        return res.status(200).json(message("Categorías consultadas", response.rows))
      } catch (e) {
        return res.status(500).json(message("Error, al consultar las categorías"))
      }
    case "POST":
      try {
        const keys_required = ["name", "url"]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

        const responseCategory = await conn.query(`SELECT url, active
                                                   FROM categories
                                                   WHERE url = '${body.url}';`)

        if (responseCategory.rows.length > 0 && responseCategory.rows[0].active) return res.status(500).json(message("Error, la url ya existe"))

        const keys_filter = ["name", "father", "url"]

        try {
          response = await conn.query(query_insert(await filtrar_llaves(body, keys_filter), "categories"))
        } catch (e) {
          body.url = `${body.url}-${uuid().split("-")[0]}`
          response = await conn.query(query_insert(await filtrar_llaves(body, keys_filter), "categories"))
        }

        return res.status(200).json(message("Categoría registrada", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al registrar la categoría"))
      }
    default:
      return res.status(400).json(message("Method not allowed"))
  }
}

export default categories