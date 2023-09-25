import {Layout} from "@/components/Layout/Layout";
import {Product} from "@/interfaces/Product";
import {useEffect, useState} from "react";
import axios from "axios";
import process from "process";
import {LoadingPage} from "@/components/LoadingPage";
import {Badge, Box} from "@chakra-ui/react";
import {BannerHome} from "@/components/Layout/BannerHome";


interface ResponsePost {
  id: number,
  name: string,
  url: string,
  products: Product[]
}


const Index = () => {
  const [data, setData] = useState<ResponsePost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    axios.get('api/v1/home',
      {
        headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}
      })
      .then(res => {
        setData(res.data.response)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <Layout title={"GI Life"}>
      {
        isLoading
          ? (<LoadingPage/>)
          : (<Box>
            <BannerHome/>
          </Box>)
      }
    </Layout>
  )
}

export default Index