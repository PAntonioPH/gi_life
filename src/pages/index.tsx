import {Layout} from "@/components/Layout/Layout";
import {BannerHome} from "@/components/Layout/BannerHome";
import {Product} from "@/interfaces/Product";
import {useEffect, useState} from "react";
import axios from "axios";
import process from "process";
import {LoadingPage} from "@/components/LoadingPage";
import {Badge, Box, Heading} from "@chakra-ui/react";
import {SliderMultiple} from "@/components/SliderMultiple";

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
          : (<>
            <BannerHome/>
            {
              data.map(({name, products, url, id}) => (
                products.length > 0
                && (<Box
                  key={id}
                  my={5}
                >
                  <Box
                    bg={"#ffffff"}
                    px={5}
                    mx={5}
                    py={2}
                    borderLeft={"6px solid #00347f"}
                  >
                    <Heading
                      color={"black"}
                      mt={5}
                      size={"lg"}
                    >
                      {name}
                    </Heading>
                  </Box>
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