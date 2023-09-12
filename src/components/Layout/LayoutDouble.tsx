import {Flex, FlexProps, useBreakpointValue} from '@chakra-ui/react'
import {Placeholder} from './Placeholder'
import {Navbar} from "@/components/Layout/Navbar";
import {Footer} from "@/components/Layout/Footer";
import {AnnouncementsRight} from "@/components/Layout/AnnouncementsRight";
import {useEffect} from "react";
import axios from "axios";
import {AnnouncementsLeft} from "@/components/Layout/AnnouncementsLeft";

interface Props extends FlexProps {
}

export const LayoutDouble = (props: Props) => {
  const isDesktop = useBreakpointValue({base: false, lg: true})
  const {children} = props

  useEffect(() => {
    axios.post("/api/v1/visits", {}, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}}).then()
  }, [])

  return (
    <>
      <Flex direction="column" flex="1">
        <Navbar/>
        <Flex
          direction={{base: "column", md: "row"}}
        >
          {
            isDesktop
            && (<AnnouncementsLeft/>)
          }
          <Flex
            as="main"
            role="main"
            direction="column"
            flex="1"
            w={{base: "100%", md: "50%"}}
            px={{base: 4, md: 8}}
            {...props}
          >
            <Placeholder bg="bg-accent">
              {children}
            </Placeholder>
          </Flex>
          {
            !isDesktop
            && (<AnnouncementsLeft/>)
          }
          <AnnouncementsRight/>
        </Flex>
        <Footer/>
      </Flex>
    </>
  )
}


