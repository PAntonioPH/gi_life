import {Flex, FlexProps} from '@chakra-ui/react'
import {Navbar} from "@/components/Layout/Navbar";
import {Footer} from "@/components/Layout/Footer";
import Head from "next/head";
import {Placeholder} from "@/components/Layout/Placeholder";

interface Props extends FlexProps {
  title: string;
}

export const Layout = (props: Props) => {
  const {children, title} = props
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="shortcut icon" href="/assets/icons/favicon.ico"/>

        <meta property="og:title" content="GI Life"/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://gilife.com.mx/"/>
        <meta property="og:image" content="https://gilife.com.mx//assets/icons/logoMeta.jpg"/>
        <meta property="og:image/png" content="https://gilife.com.mx//assets/icons/logo.png"/>

        <meta property="twitter:title" content="GI Life"/>
        <meta property="twitter:site" content="https://gilife.com.mx/"/>
        <meta property="twitter:image" content="https://gilife.com.mx//assets/icons/logo.png"/>
      </Head>

      <Flex direction="column" flex="1">
        <Navbar/>

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
            <Placeholder bg="bg-accent" minH="xl">
              {children}
            </Placeholder>
          </Flex>
        </Flex>
        <Footer/>
      </Flex>
    </>
  )
}


