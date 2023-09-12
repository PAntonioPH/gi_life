import {LayoutSingle} from "@/components/Layout/LayoutSingle";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {LoadingPage} from "@/components/LoadingPage";
import {Box, Center, Divider, Flex, Heading, HStack, Img, SimpleGrid, Stack, Text, VStack} from "@chakra-ui/react";
import {Slider} from "@/components/Slider";
import {useRouter} from "next/router";
import {VideoFB} from "@/components/VideoFB";

interface PropsPost {
  id: number,
  title: string,
  img: string,
  category: string,
  category_name: string,
}

interface PropsData {
  estado: PropsPost[],
  altiplano: PropsPost[],
  nacional: PropsPost[],
  internacional: PropsPost[],
  deporte: PropsPost[],
  espectaculo: PropsPost[],
  municipios: PropsPost[],
  mostRead: PropsPost[],
  circePolitico: PropsPost[],
  EstratagemaInversa: PropsPost[],
}

const Index = () => {
  const router = useRouter()
  const [data, setData] = useState<PropsData>({
    estado: [],
    altiplano: [],
    nacional: [],
    internacional: [],
    deporte: [],
    espectaculo: [],
    municipios: [],
    mostRead: [],
    circePolitico: [],
    EstratagemaInversa: [],
  })
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/v1/home', {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(res => {
        setData(res.data.response)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleClickPost = async (category: string, id: number) => await router.push(`/category/${category}/post/${id}`)

  return (
    <LayoutSingle title={"La Opinión del Altiplano"}>
      {
        isLoading && data.estado.length === 0
          ? (<LoadingPage/>)
          : (<>
            <Box
              pb={10}
            >
              <Heading as="h1" size="lg">Ultimas entradas</Heading>
              <Divider borderColor="#a02142" borderWidth="1px"/>
            </Box>

            <Flex
              h={{md: "600px", base: "auto"}}
              borderRadius={"md"}
              cursor={"pointer"}
              direction={{md: 'row', base: 'column'}}
            >
              <VStack
                w={{md: "30%", base: "100%"}}
                mt={{md: 0, base: 5}}
                h={"100%"}
              >
                <Flex
                  flexDirection={"column"}
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
                    El clima de hidalgo
                  </Heading>

                  <VideoFB
                    id={2}
                  />
                </Flex>

                <Flex
                  flexDirection={"column"}
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
                    Hidalgo Opina
                  </Heading>

                  <VideoFB
                    id={3}
                  />
                </Flex>
              </VStack>

              <Flex
                w={{md: "70%", base: "100%"}}
                bgImage={data.estado[0].img && data.estado[0].img != "" ? `url(${data.estado[0].img})` : `url(/assets/images/placeholderImg.jpg)`}
                bgSize={"cover"}
                bgPosition={"center"}
                bgRepeat={"no-repeat"}
                borderRightRadius={"md"}
                flexDirection={"column"}
                justifyContent={"end"}
                onClick={() => handleClickPost(data.estado[0].category, data.estado[0].id)}
                h={{md: "100%", base: "300px"}}
              >
                <Heading
                  as="h1"
                  size="sm"
                  mb={5}
                  color={"white"}
                  bg={"#400d1c"}
                  m={5}
                  borderRadius={"md"}
                  textAlign={"center"}
                  p={3}
                >
                  {data.estado[0].title}
                </Heading>
              </Flex>
            </Flex>

            <Divider borderColor="#a02142" borderWidth="1px" my={20}/>

            <Center>
              <Text
                bg={"#bf9b5a"}
                color={"white"}
                mb={5}
                fontSize={"2xl"}
                borderRadius={"full"}
                px={10}
                py={1}
              >
                Altiplano
              </Text>
            </Center>

            <SimpleGrid
              spacing={{md: 10, base: 5}}
              columns={{md: 3, base: 1}}
            >
              {
                data.altiplano.map(({id, title, img, category, category_name}) =>
                  <Flex
                    key={id}
                    bgImage={img && img != "" ? `url(${img})` : `url(/assets/images/placeholderImg.jpg)`}
                    bgSize={"cover"}
                    bgPosition={"center"}
                    bgRepeat={"no-repeat"}
                    borderRadius={"md"}
                    cursor={"pointer"}
                    h={"200px"}
                    onClick={() => handleClickPost(category, id)}
                    direction={"column"}
                    justifyContent={"space-between"}
                  >
                    <Text
                      fontSize='md'
                      bg='#400d1c'
                      color='white'
                      p={1}
                      mb={4}
                      w='full'
                      textAlign={"center"}
                    >
                      {category_name}
                    </Text>

                    <Heading
                      size='xs'
                      color={"white"}
                      mb={2}
                      textShadow={"2px 2px 4px #000000"}
                      bg={"blackAlpha.500"}
                      textAlign={"center"}
                      px={2}
                    >
                      {title}
                    </Heading>
                  </Flex>
                )
              }
            </SimpleGrid>

            <Divider borderColor="#a02142" borderWidth="1px" mt={10} mb={10}/>

            <Center>
              <Heading
                as="h1"
                size="lg"
                mb={5}
                color={"white"}
                bg={"#400d1c"}
                px={10}
              >
                Nacional
              </Heading>
            </Center>

            <Slider
              posts={data.nacional}
              handleClick={(index: number) => router.push(`/category/${data.nacional[index].category}/post/${data.nacional[index].id}`)}
              defaultImage={'/assets/images/placeholderImg.jpg'}
            />

            <Divider borderColor="#a02142" borderWidth="1px" mt={10} mb={10}/>

            <Center>
              <Heading
                as="h1"
                size="lg"
                mb={5}
                color={"white"}
                bg={"#400d1c"}
                px={10}
              >
                Internacional
              </Heading>
            </Center>

            <Slider
              posts={data.internacional}
              handleClick={(index: number) => router.push(`/category/${data.internacional[index].category}/post/${data.internacional[index].id}`)}
              defaultImage={'/assets/images/placeholderImg.jpg'}
            />

            <Divider borderColor="#a02142" borderWidth="1px" mt={10} mb={10}/>

            <Center>
              <Heading
                as="h1"
                size="lg"
                mb={5}
                color={"white"}
                bg={"#400d1c"}
                px={10}
              >
                Deportes
              </Heading>
            </Center>

            <Slider
              posts={data.deporte}
              handleClick={(index: number) => router.push(`/category/${data.deporte[index].category}/post/${data.deporte[index].id}`)}
              defaultImage={'/assets/images/placeholderImg.jpg'}
            />

            <Divider borderColor="#a02142" borderWidth="1px" mt={10} mb={10}/>

            <Stack
              w={"100%"}
              direction={{md: 'row', base: 'column'}}
            >
              <Flex
                bgImage={data.espectaculo[0].img && data.espectaculo[0].img != "" ? `url(${data.espectaculo[0].img})` : `url(/assets/images/placeholderImg.jpg)`}
                bgSize={"cover"}
                bgPosition={"center"}
                bgRepeat={"no-repeat"}
                onClick={() => handleClickPost(data.espectaculo[0].category, data.espectaculo[0].id)}
                flexDirection={"column"}
                justifyContent={"space-between"}
                alignItems={"flex-end"}
                borderRadius={"md"}
                boxShadow={"dark-lg"}
                cursor={"pointer"}
                h={"300px"}
                w={{md: "50%", base: "100%"}}
              >
                <Text
                  color={"white"}
                  bg={"#400d1c"}
                  p={1}
                >
                  Espectáculos
                </Text>

                <Flex
                  flexDirection={"row"}
                  justifyContent={"center"}
                  alignItems={"flex-end"}
                  bg={"blackAlpha.500"}
                  borderBottomRadius={"md"}
                >
                  <Text
                    color={"white"}
                    fontSize={{md: "2xl", base: "xl"}}
                    textAlign={"center"}
                    p={5}
                    textShadow={"2px 2px 4px #000000"}
                  >
                    {data.espectaculo[0].title}
                  </Text>
                </Flex>
              </Flex>

              <Flex
                bgImage={data.circePolitico[0].img && data.circePolitico[0].img != "" ? `url(${data.circePolitico[0].img})` : `url(/assets/images/placeholderImg.jpg)`}
                bgSize={"cover"}
                bgPosition={"center"}
                bgRepeat={"no-repeat"}
                onClick={() => handleClickPost(data.circePolitico[0].category, data.circePolitico[0].id)}
                flexDirection={"column"}
                justifyContent={"space-between"}
                alignItems={"flex-end"}
                borderRadius={"md"}
                boxShadow={"dark-lg"}
                cursor={"pointer"}
                h={"300px"}
                w={{md: "23%", base: "100%"}}
              >
                <Text
                  color={"white"}
                  bg={"#400d1c"}
                  p={1}
                >
                  Circe Político
                </Text>

                <Flex
                  flexDirection={"row"}
                  justifyContent={"center"}
                  alignItems={"flex-end"}
                  bg={"blackAlpha.500"}
                  borderBottomRadius={"md"}
                >
                  <Text
                    color={"white"}
                    fontSize={{md: "2xl", base: "xl"}}
                    textAlign={"center"}
                    p={5}
                    textShadow={"2px 2px 4px #000000"}
                  >
                    {data.circePolitico[0].title}
                  </Text>
                </Flex>
              </Flex>

              <Flex
                bgImage={data.EstratagemaInversa[0].img && data.EstratagemaInversa[0].img != "" ? `url(${data.EstratagemaInversa[0].img})` : `url(/assets/images/placeholderImg.jpg)`}
                bgSize={"cover"}
                bgPosition={"center"}
                bgRepeat={"no-repeat"}
                onClick={() => handleClickPost(data.EstratagemaInversa[0].category, data.EstratagemaInversa[0].id)}
                flexDirection={"column"}
                justifyContent={"space-between"}
                alignItems={"flex-end"}
                borderRadius={"md"}
                boxShadow={"dark-lg"}
                cursor={"pointer"}
                h={"300px"}
                w={{md: "23%", base: "100%"}}
              >
                <Text
                  color={"white"}
                  bg={"#400d1c"}
                  p={1}
                >
                  Estratagema a la Inversa
                </Text>

                <Flex
                  flexDirection={"row"}
                  justifyContent={"center"}
                  alignItems={"flex-end"}
                  bg={"blackAlpha.500"}
                  borderBottomRadius={"md"}
                >
                  <Text
                    color={"white"}
                    fontSize={{md: "2xl", base: "xl"}}
                    textAlign={"center"}
                    p={5}
                    textShadow={"2px 2px 4px #000000"}
                  >
                    {data.EstratagemaInversa[0].title}
                  </Text>
                </Flex>
              </Flex>
            </Stack>

            <Divider borderColor="#a02142" borderWidth="1px" mt={10} mb={10}/>

            <Flex
              direction={{md: 'row', base: 'column'}}
            >
              <Flex
                w={{md: "50%", base: "100%"}}
                direction={"column"}
              >
                <Box>
                  <Text
                    fontSize={{md: "2xl", base: "xl"}}
                    bg={"#400d1c"}
                    color={"white"}
                    w={"max-content"}
                    px={10}
                  >
                    Lo más visto
                  </Text>

                  <Divider borderColor="#a02142" borderWidth="1px" mt={3} mb={10}/>
                </Box>

                <Box>
                  {
                    data.mostRead.map(({id, title, img, category, category_name}, index) => (
                      <HStack
                        key={id}
                        spacing={5}
                        cursor={"pointer"}
                        onClick={() => handleClickPost(category, id)}
                        p={2}
                        pb={{md: 10, base: 5}}
                        _hover={{
                          bg: "blackAlpha.100",
                          borderRadius: "md",
                          textDecoration: "underline"
                        }}
                      >
                        <Text
                          fontSize={{md: "2xl", base: "xl"}}
                          as={"b"}
                        >
                          {index + 1}.
                        </Text>
                        <Text
                          key={id}
                          fontSize={{md: "xl", base: "md"}}
                          as={"b"}
                        >
                          {title}
                        </Text>
                      </HStack>
                    ))
                  }
                </Box>
              </Flex>

              <Flex
                w={{md: "50%", base: "100%"}}
                ml={{md: "3rem", base: 0}}
                direction={"column"}
                mt={{md: 0, base: 10}}
              >
                <Box>
                  <Text
                    fontSize={{md: "2xl", base: "xl"}}
                    bg={"#400d1c"}
                    color={"white"}
                    w={"max-content"}
                    px={10}
                  >
                    Municipios
                  </Text>

                  <Divider borderColor="#a02142" borderWidth="1px" mt={3} mb={10}/>
                </Box>

                <Box>
                  <Box
                    cursor={"pointer"}
                    onClick={() => handleClickPost(data.municipios[0].category, data.municipios[0].id)}
                    _hover={{
                      textDecoration: "underline"
                    }}
                  >
                    <Img
                      src={data.municipios[0].img && data.municipios[0].img != "" ? data.municipios[0].img : "/assets/images/placeholderImg.jpg"}
                      alt={"Municipios"}
                      h={"200px"}
                      w={"100%"}
                      objectFit={"cover"}
                      borderRadius={"md"}
                    />

                    <Text
                      fontSize={"xl"}
                      as={"b"}
                    >
                      {data.municipios[0].title}
                    </Text>
                  </Box>

                  <Flex
                    pt={5}
                    flexDirection={"column"}
                  >
                    {
                      data.municipios.slice(1, 3).map(({id, title, category}, index) => (
                        <Text
                          key={index}
                          fontSize={{md: "xl", base: "md"}}
                          as={"b"}
                          cursor={"pointer"}
                          onClick={() => handleClickPost(category, id)}
                          _hover={{
                            textDecoration: "underline"
                          }}
                          pb={10}
                        >
                          {title}
                        </Text>
                      ))
                    }
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </>)
      }
    </LayoutSingle>
  )
}

export default Index