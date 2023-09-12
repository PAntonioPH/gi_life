import {Box, Divider, Flex, Heading, Image, useBreakpointValue} from "@chakra-ui/react";

export const AnnouncementsLeft = () => {
  const isDesktop = useBreakpointValue({base: false, lg: true})

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
        <Heading as="h1" size="lg">:::::</Heading>
        <Divider borderColor="#a02142" borderWidth="1px"/>
      </Box>

      <Divider my={5} borderColor="gray.200" borderWidth="1px"/>
      <Box>
        <Image
          src={`/assets/campanas/ban2.png`}
          alt={'Conducir'}
        />
      </Box>
      <Divider my={5} borderColor="gray.200" borderWidth="1px"/>
      <Box>
        <Image
          src={`/assets/campanas/ban5.jpg`}
          alt={'Conducir'}
        />
      </Box>
      <Divider my={5} borderColor="gray.200" borderWidth="1px"/>
      <Image
        src={`/assets/campanas/bann.png`}
        alt={'Casa de empeño'}
        onClick={() => window.open(`https://hidalgo.travel/wordpress/?page_id=5312`, '_blank')}
        cursor={"pointer"}
      />
      <Divider my={5} borderColor="gray.200" borderWidth="1px"/>

    </Flex>
  )
}

