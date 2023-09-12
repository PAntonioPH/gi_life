import {Box, Divider, Flex, Heading, Image, useBreakpointValue} from "@chakra-ui/react";
import {TimelineTwitter} from "@/components/SocialMedia/TimelineTwitter";
import {TimelineFacebook} from "@/components/SocialMedia/TimelineFacebook";
import React from "react";
import {LastNews} from "@/components/LastNews";
import {useRouter} from "next/router";
import {VideoFB} from "@/components/VideoFB";

export const AnnouncementsRight = () => {
  const router = useRouter()
  const isDesktop = useBreakpointValue({base: false, xl: true})
  return (<Flex
      as="aside"
      direction="column"
      w={{base: "100%", md: "20%"}}
      pr={{base: 8, md: 2}}
      pl={{base: 8, md: 2}}
      pt={{base: 0, md: 3}}
    >
      <Box
        mb={5}
      >
        <Heading as="h1" size="lg"> :::::</Heading>
        <Divider borderColor="#a02142" borderWidth="1px"/>
      </Box>

      <Flex
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Heading
          as="h1"
          size="lg"
          textAlign="center"
          mb={5}
          textTransform="uppercase"
          textDecoration={"underline"}
        >
          El día en un minuto
        </Heading>

        <VideoFB
          id={1}
        />
      </Flex>

      <Divider my={5} borderColor="gray.200" borderWidth="1px"/>

      <LastNews/>

      <Image
        src="/assets/icons/boton.png"
        alt="boton"
        onClick={() => window.open(`mailto:laopiniondelaltiplano@gmail.com?subject=Quiero%20hacer%20un%20Reporte`, '_blank')}
        cursor={"pointer"}
      />

      <Divider my={5} borderColor="gray.200" borderWidth="1px"/>

      <Image
        src="/assets/icons/periodico.png"
        alt="periodico"
        onClick={() => router.push("/news")}
        cursor={"pointer"}
      />

      <Divider my={5} borderColor="gray.200" borderWidth="1px"/>

      <Divider my={5} borderColor="gray.200" borderWidth="1px"/>
      <TimelineFacebook/>


      <Divider my={5} borderColor="gray.200" borderWidth="1px"/>
      <Box>
        <Image
          src={`/assets/campanas/ban4.jpg`}
          alt={'Casa de empeño'}
        />
      </Box>
      <Divider my={5} borderColor="gray.200" borderWidth="1px"/>

      <TimelineTwitter/>

      <Divider my={5} borderColor="gray.200" borderWidth="1px"/>
      {/*<Box>*/}
      {/*  <iframe width="250" height="300" src="https://www.youtube.com/embed/eW-A76Rkj_4"*/}
      {/*          title="YouTube video player"*/}
      {/*          frameBorder="0"*/}
      {/*          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"*/}
      {/*          allowFullScreen>*/}

      {/*  </iframe>*/}
      {/*</Box>*/}

      {/*<Divider my={5} borderColor="gray.200" borderWidth="1px"/>*/}

      {/*<Box>*/}
      {/*  <iframe width="250" height="300" src="https://www.youtube.com/embed/7BSBMkU86XQ"*/}
      {/*          title="YouTube video player"*/}
      {/*          frameBorder="0"*/}
      {/*          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"*/}
      {/*          allowFullScreen>*/}

      {/*  </iframe>*/}
      {/*</Box>*/}

      <Divider my={5} borderColor="gray.200" borderWidth="1px"/>
      <Box>
        <Image
          src={`/assets/campanas/ban1.png`}
          alt={'Casa de empeño'}
        />
      </Box>
      <Divider my={5} borderColor="gray.200" borderWidth="1px"/>
    </Flex>
  )
}

