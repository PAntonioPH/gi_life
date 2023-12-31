import {Layout} from "@/components/Layout/Layout";
import {Product} from "@/interfaces/Product";
import {useEffect, useState} from "react";
import axios from "axios";
import process from "process";
import {LoadingPage} from "@/components/LoadingPage";
import {Box, Flex, Heading} from "@chakra-ui/react";
import {SliderMultiple} from "@/components/SliderMultiple";
import {useRouter} from "next/router";

interface ResponsePost {
  id: number,
  name: string,
  url: string,
  products: Product[]
}

const Index = () => {
  const router = useRouter()
  const [data, setData] = useState<ResponsePost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/v1/home',
      {
        headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}
      })
      .then(res => {
        setData(res.data.response)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title={"GI Life"}>
      {
        loading
          ? (<LoadingPage/>)
          : (<>
            {/*<BannerHome/>*/}
            {
              data.map(({name, products, url, id}) => (
                products.length > 0
                && (<Box
                  key={id}
                  py={5}
                >
                  <Flex
                    p={5}
                    borderLeft={"6px solid #00347f"}
                    bg={"#f5f5f5"}
                    cursor={"pointer"}
                    _hover={{
                      textDecoration: "underline"
                    }}
                    onClick={() => router.push(`/category/${url}`)}
                  >
                    <Heading
                      color={"black"}
                      size={"lg"}
                    >
                      {name}
                    </Heading>
                  </Flex>

                  <SliderMultiple products={products} url={url}/>
                </Box>)
              ))
            }
          </>)
      }
    </Layout>
  )
}

export default Index