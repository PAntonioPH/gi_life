import {NextApiRequest, NextApiResponse} from "next";
import {filtrar_llaves, message, validar_llaves} from "@/utils/functions";
import {conn} from "@/utils/database";
import moment from "moment";
import {News} from "@/interfaces/News";
import {uploadFile} from "@/utils/s3";
import {query_insert} from "@/utils/postgres";
import {postTwitter} from "@/utils/twitter";
import {postFacebook} from "@/utils/facebook";

const News = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, query, body} = req

  let response

  switch (method) {
    case 'GET':
      try {
        const {home, page} = query

        response = await conn.query(`SELECT id, url, cover_url, date_update, date
                                     FROM news
                                     WHERE active = true
                                     ORDER BY date_update ${(page && page === 'true') || (home && home === 'true') ? 'DESC' : 'ASC'}
                                         ${home && home === 'true' ? 'LIMIT 1' : ''};`)

        if (response.rows.length > 0) response.rows.map((news: News) => news.date = moment(news.date).format("DD/MM/YYYY"))

        if (page && page === 'true') {
          let responsePage: any = []

          response.rows.forEach((news: News) => {
            const actualYear = responsePage.find((year: any) => year.year === parseInt(moment(news.date, "DD/MM/YYYY").format("YYYY")))

            if (actualYear) {
              const actualMonth = actualYear.months.find((month: any) => month.month === parseInt(moment(news.date, "DD/MM/YYYY").format("MM")))

              if (actualMonth) {
                actualMonth.news = [
                  ...actualMonth.news,
                  news
                ]
              } else {
                actualYear.months = [
                  ...actualYear.months,
                  {
                    nameMonth: moment(news.date, "DD/MM/YYYY").format("MMMM"),
                    month: parseInt(moment(news.date, "DD/MM/YYYY").format("MM")),
                    news: [news]
                  }
                ]
              }
            } else {
              responsePage = [
                ...responsePage,
                {
                  year: parseInt(moment(news.date, "DD/MM/YYYY").format("YYYY")),
                  months: [
                    {
                      nameMonth: moment(news.date, "DD/MM/YYYY").format("MMMM"),
                      month: parseInt(moment(news.date, "DD/MM/YYYY").format("MM")),
                      news: [news]
                    }
                  ]
                }
              ]
            }
          })

          responsePage = responsePage.sort((a: any, b: any) => b.year - a.year)
          responsePage.forEach((year: any) => year.months = year.months.sort((a: any, b: any) => b.month - a.month))

          return res.status(200).json(message("Periódicos obtenidos correctamente", responsePage))
        }

        return res.status(200).json(message("Periodico obtenido correctamente", home && home === 'true' ? response.rows[0] : response.rows))
      } catch (e) {
        return res.status(500).json(message("Error, al obtener el periodico"))
      }
    case 'POST':
      try {
        const keys_required = ['date', 'cover', 'coverName', 'url', 'news_embed'];
        const validation = await validar_llaves(keys_required, body);

        if (!validation.success) return res.status(400).json(message(validation.message));

        const {cover, coverName} = body

        if (cover && coverName && coverName !== "") {
          const result = await uploadFile(cover, `portada-${coverName}`);

          if (!result.success || !result.response) return res.status(500).json(message("Error, al subir la portada"));

          body.cover_url = result.response.url;
        } else {
          delete body.cover_url;
        }

        const keys_filter = ['date', 'cover_url', 'url', 'news_embed'];

        response = await conn.query(query_insert(await filtrar_llaves(body, keys_filter), "news"))

        const link = `https://laopiniondelaltiplano.com/news/${response.rows[0].id}`
        const content = `¡Ya puedes leer la edición del día! \n¡No te lo pierdas!`

        try {
          await postTwitter(content, link)
        } catch (e) {
          console.log(e)
        }

        try {
          await postFacebook(`${content}.`, link)
        } catch (e) {
          console.log(e)
        }

        return res.status(200).json(message("Periodico registrado correctamente", response.rows[0]))
      } catch (e) {
        return res.status(500).json(message("Error, al registrar el periodico"))
      }
    default:
      return res.status(400).json(message("Method not allowed"));
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1gb',
    }
  }
}

export default News