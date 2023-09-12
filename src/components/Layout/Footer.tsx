import {Box, BoxProps, ButtonGroup, Center, Flex, Heading, IconButton, SimpleGrid, Text} from '@chakra-ui/react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faFacebook, faInstagram, faTwitter} from "@fortawesome/free-brands-svg-icons"
import {Logo} from "@/components/Logo";
import {useEffect, useState} from "react";
import {Category} from "@/interfaces/Category";
import axios from "axios";
import {useRouter} from "next/router";


export const Footer = (props: BoxProps) => {
  const router = useRouter()
  const handleClick = async (url: string) => await router.push(url === "/" ? "/" : `/category/${url}`)

  const [sections, setSections] = useState<Category[]>([])
  useEffect(() => {
    axios.get('/api/v1/categories', {
      headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}
    })
      .then(res => {
        setSections(res.data.response)
      })
  }, [])
  const redes = [
    {
      name: "Facebook",
      icon: <FontAwesomeIcon fontSize="2rem" icon={faFacebook}/>,
      url: "https://www.facebook.com/LaOpiniondeHidalgo/"
    },
    {
      name: "Instagram",
      icon: <FontAwesomeIcon fontSize="2rem" icon={faInstagram}/>,
      url: "https://www.instagram.com/laopinionhidalgo1/"
    },
    {
      name: "Twitter",
      icon: <FontAwesomeIcon fontSize="2rem" icon={faTwitter}/>,
      url: "https://twitter.com/LaopinionHidalg"
    },
  ]

  return (
    <Box as="footer" role="contentinfo" px={{base: '8'}} mt={10} bg={"#cccccc"} {...props}>
      <Flex
        pt={{base: '12', md: '10'}}
        direction={{base: 'column', md: 'row'}}
      >
        <Flex
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          w={{base: "100%", md: "20%", ls: "100%"}}
          mr={10}
        >
          <Center>
            <Logo w={"300"}/>
          </Center>
          <Heading
            pb={5}
            size={"sm"}
            mt={'8'}
            color={"#6a1834"}
          >
            Síguenos en nuestras Redes Sociales </Heading>
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
          w={{base: "100%", md: "80%"}}
        >
          <Heading
            color={"#6a1834"}
            fontFamily={"sans-serif"}
            pb={5}
            pt={5}
          >
            Secciones
          </Heading>

          <SimpleGrid
            columns={{base: 3, md: 7}}
            spacing={3}
          >
            {sections.map((section, index) => (
              <Text
                key={index}
                onClick={() => handleClick(section.url)}
                cursor={"pointer"}
                _hover={{
                  textDecoration: "underline"
                }}
                w={"100%"}
                h={"100%"}
              >
                {
                  section.name
                }
              </Text>
            ))}
          </SimpleGrid>
          <Flex
            direction={"column"}
            alignItems={"center"}
            pb={10}
          >
            <Text
              textAlign={"center"}
              pt={10}
              fontSize={"xs"}
            >
              Derechos Reservados © 2023 La Opinión del Altiplano. Queda estrictamente
              prohibida la reproducción, distribución, o cualquier uso no autorizado del contenido de este material, ya
              sea
              de forma
              parcial o total, sin la previa autorización por escrito del titular de los derechos. Todos los derechos
              están
              reservados.
            </Text>
            <Text fontSize="xs" color="#6a1834">
              &copy; {new Date().getFullYear()} La Opinión del Altiplano. All rights reserved.
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}
