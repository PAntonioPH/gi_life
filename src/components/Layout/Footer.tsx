import {Box, BoxProps, ButtonGroup, Flex, Heading, IconButton, Text} from '@chakra-ui/react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faFacebook, faInstagram} from "@fortawesome/free-brands-svg-icons"
import {Logo} from "@/components/Logo";

export const Footer = (props: BoxProps) => {
  const redes = [
    {
      name: "Facebook",
      icon: <FontAwesomeIcon fontSize="2rem" icon={faFacebook}/>,
      url: "https://www.facebook.com/GiLife"
    },
    {
      name: "Instagram",
      icon: <FontAwesomeIcon fontSize="2rem" icon={faInstagram}/>,
      url: "https://www.instagram.com/gilife.mexico/"
    },
  ]

  return (
    <Box as="footer" role="contentinfo" px={{base: '8'}} bgGradient="linear(to-r, #a8b9e8, #e9b0d1, #f7b6c1)" {...props}>
      <Flex
        py={{base: '12', md: '10'}}
        direction={{base: 'column', md: 'row'}}
      >
        <Flex
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          w={{base: "100%", md: "20%", ls: "100%"}}
          mr={10}
        >
          <Logo w={"300"}/>
          <Heading
            pb={5}
            size={"sm"}
            mt={'8'}
            color={"#0a6770"}
          >
            ¡Síguenos en nuestras Redes Sociales! </Heading>
          <ButtonGroup variant="ghost" spacing={10}>
            {
              redes.map(({name, url, icon}) => (
                <IconButton
                  variant="link"
                  colorScheme="black"
                  target={"_blank"}
                  key={name}
                  as="a"
                  href={url}
                  aria-label={name}
                  icon={icon}
                />
              ))
            }
          </ButtonGroup>
        </Flex>

        <Flex
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          w={{base: "100%", md: "80%"}}
        >
          <Flex
            direction={"column"}
            alignItems={"center"}
          >
            <Text
              textAlign={"center"}
              pt={10}
              fontSize={"md"}

            >
              Derechos Reservados © 2023 GI Life. Queda estrictamente
              prohibida la reproducción, distribución, o cualquier uso no autorizado del contenido de este material, ya
              sea
              de forma
              parcial o total, sin la previa autorización por escrito del titular de los derechos. Todos los derechos
              están
              reservados.
            </Text>
            <Text fontSize="sm" color="#0a6770">
              &copy; {new Date().getFullYear()} GI Life. All rights reserved.
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}
