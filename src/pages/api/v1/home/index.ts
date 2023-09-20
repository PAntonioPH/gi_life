import {NextApiRequest, NextApiResponse} from "next";
import {message} from "@/utils/functions";
import {conn} from "@/utils/database";
import {decodeHTML5} from "entities";

interface CategoryType {
  id: number,
  name: string,
  url: string,
  father?: number
  products?: Array<any>
}

const home = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method} = req

  switch (method) {
    case "GET":
      try {
        const responseCategories = await conn.query(`SELECT id, name, url, father
                                                     FROM categories
                                                     WHERE active = true
                                                       AND id != 0;`)

        if (responseCategories.rows.length < 1) return res.status(404).json(message("No hay categorías"))

        const categories = responseCategories.rows.filter((category: CategoryType) => !responseCategories.rows.some((child: CategoryType) => child.father === category.id));

        categories.forEach((category: CategoryType) => delete category.father)

        const responseProducts = await conn.query(`SELECT p.id,
                                                          p.name,
                                                          p.price,
                                                          p.discount,
                                                          p.stock,
                                                          p.description,
                                                          p.images,
                                                          c.name as category
                                                   FROM product AS p
                                                            JOIN categories c on p.id_category = c.id
                                                   WHERE p.active = true
                                                   ORDER BY p.id DESC;`)

        if (responseProducts.rows.length < 1) return res.status(404).json(message("No hay productos"))

        responseProducts.rows.forEach((product: any) => product.images = JSON.parse(product.images))
        responseProducts.rows.forEach((product: any) => product.description = decodeHTML5(product.description).replace(/<[^>]*>?/gm, ''))

        categories.forEach((category: CategoryType) => category.products = responseProducts.rows.filter((product: any) => product.category === category.name))

        return res.status(200).json(message("Categorías consultadas", categories))
      } catch (e) {
        return res.status(500).json(message("Error al consultar los productos"))
      }
  }
}

export default home