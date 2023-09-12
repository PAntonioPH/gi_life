import {Center, Flex, FlexProps, Image} from '@chakra-ui/react'
import {Placeholder} from './Placeholder'
import {Navbar} from "@/components/Layout/Navbar";
import {Footer} from "@/components/Layout/Footer";
import Head from "next/head";
import {AnnouncementsRight} from "@/components/Layout/AnnouncementsRight";
import React, {useEffect} from "react";
import axios from "axios";

interface Props extends FlexProps {
  title: string;
}

export const LayoutSingle = (props: Props) => {
  const {children, title} = props

  useEffect(() => {
    axios.post("/api/v1/visits", {}, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}}).then()
  }, [])

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="shortcut icon" href="/assets/icons/favicon.ico"/>

        <meta property="og:title" content="La Opinión del Altiplano"/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://laopiniondelaltiplano.com"/>
        <meta property="og:image" content="https://laopiniondelaltiplano.com/assets/icons/logoMeta.jpg"/>
        <meta property="og:image/png" content="https://laopiniondelaltiplano.com/assets/icons/logo.png"/>

        <meta property="twitter:title" content="La Opinión del Altiplano"/>
        <meta property="twitter:site" content="https://laopiniondelaltiplano.com"/>
        <meta property="twitter:image" content="https://laopiniondelaltiplano.com/assets/icons/logo.png"/>
      </Head>

      <Flex direction="column" flex="1">
        <Navbar/>

        <Image
          src={`/assets/campanas/ban3.jpg`}
          alt={'Casa de empeño'}
          pb={5}
        />

        <Flex
          direction={{base: "column", md: "row"}}
        >
          <Flex
            as="main"
            role="main"
            direction="column"
            flex="1"
            w={{base: "100%", md: "70%"}}
            {...props}
          >
            <Placeholder bg="bg-accent">
              {children}
            </Placeholder>
          </Flex>
          <AnnouncementsRight/>
        </Flex>
        <Footer/>
      </Flex>
    </>
  )
}


