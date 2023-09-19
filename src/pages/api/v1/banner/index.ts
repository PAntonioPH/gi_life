import {NextApiRequest, NextApiResponse} from "next";
import {filtrar_llaves, message, validar_llaves} from "@/utils/functions";
import {uploadFile} from "@/utils/s3";
import {conn} from "@/utils/database";
import {query_insert} from "@/utils/postgres";

const banner = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, body} = req

  let response: any

  switch (method) {
    case "GET":
      try {
        response = await conn.query(`SELECT id, title, img
                                     FROM banner
                                     WHERE active = true
                                     ORDER BY id DESC;`)

        return res.status(200).json(message("Banners consultados", response.rows))
      }catch (e) {
        return res.status(500).json(message("Error, al consultar los banners"))
      }
    case "POST":
      try {
        const keys_required = ["title", "fileName", "file64"]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

        const {fileName, file64} = body;

        if (fileName && file64) {
          const result = await uploadFile(file64, fileName, "banner")
          if (!result.success || !result.response) return res.status(500).json(message("Error, al subir el archivo"));
          body.img = result.response.url
        }

        const keys_filter = ["title", "img"]
        response = await conn.query(query_insert(await filtrar_llaves(body, keys_filter), "banner"))

        return res.status(200).json(message("Banner registrado", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al registrar el banner"))
      }
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    }
  }
}

export default banner