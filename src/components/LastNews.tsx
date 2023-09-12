import {Box, Button, Center, Image} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {News} from "@/interfaces/News";
import axios from "axios";
import {LoadingPage} from "@/components/LoadingPage";
import {useRouter} from "next/router";

export const LastNews = () => {
  const router = useRouter()
  const [lastNews, setLastNews] = useState<News>({
    id: 0,
    cover_url: "",
    url: "",
    date:"",
    news_embed: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/v1/news', {
      params: {home: true,},
      headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}
    })
      .then(res => {
        setLastNews(res.data.response)
        setLoading(false)
      })
  }, [])

  return (
    <Box>
      {
        loading
          ? (<LoadingPage/>)
          : (<>
            <Center>
              <Button
                onClick={() => router.push(`/news/${lastNews.id}`)}
                bg={"#bf9b5a"}
                color={"white"}
                borderRadius={"full"}
                _hover={{bg: "#bf9b5a"}}
              >
                Leer periódico
              </Button>
            </Center>
            <Image
              src={lastNews.cover_url}
              alt={"Periódico"}
              cursor={"pointer"}
              onClick={() => router.push(`/news/${lastNews.id}`)}
            />
          </>)
      }
    </Box>
  )
}