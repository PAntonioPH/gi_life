import {Box} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import axios from "axios";
import process from "process";
import {LoadingPage} from "@/components/LoadingPage";
import {SliderBanner} from "@/components/SliderBanner";
import {Banner} from "@/interfaces/Banner";

export const BannerHome = () => {
  const [data, setData] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    axios.get('api/v1/banner',
      {
        headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}
      })
      .then(res => {
        setData(res.data.response)
      })
      .finally(() => setIsLoading(false))
  }, [])
  return (<>
      {
        isLoading
          ? (<LoadingPage/>)
          : (<Box>
            <SliderBanner
              banner={data}
            />
          </Box>)
      }
    </>
  )
}