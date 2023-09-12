import {LayoutSingle} from "@/components/Layout/LayoutSingle";
import {Box} from "@chakra-ui/react";
import {News} from "@/interfaces/News";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import {LoadingPage} from "@/components/LoadingPage";
import parse from "html-react-parser"

const News = () => {
  const router = useRouter()

  const {id} = router.query
  const [news, setNews] = useState<News>({
    id: 0,
    url: "",
    cover_url: "",
    date: "",
    news_embed: "",
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = () => {
      axios.get(`/api/v1/news/${id}`, {
        headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}
      })
        .then(res => {
          setNews(res.data.response)
          setLoading(false)
        })
    }

    if (id && typeof id != "undefined") getData()
  }, [id])

  return (<LayoutSingle title={"News"}>
    {
      loading
        ? (<LoadingPage/>)
        : (<Box>
          <Box mt={10}>{parse(news.news_embed)}</Box>
        </Box>)
    }

  </LayoutSingle>)
}

export default News