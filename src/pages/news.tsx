import {LayoutSingle} from "@/components/Layout/LayoutSingle";
import {News} from "@/interfaces/News";
import {useEffect, useState} from "react";
import axios from "axios";
import {Img, SimpleGrid, Button, Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Text, Flex} from "@chakra-ui/react";
import {LoadingPage} from "@/components/LoadingPage";
import {useRouter} from "next/router";
import moment from "moment";

export interface NewsYearMonth {
  year: number;
  months: Month[];
}

export interface Month {
  nameMonth: string;
  month: number;
  news: News[];
}

const News = () => {
  const router = useRouter()
  const [news, setNews] = useState<NewsYearMonth[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    axios.get('/api/v1/news', {
      params: {page: true,},
      headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}
    })
      .then(res => {
        setNews(res.data.response)
        setLoading(false)
      })
  }, [])

  return (
    <LayoutSingle title={"News"}>
      {
        loading
          ? (<LoadingPage/>)
          : (<Accordion
            defaultIndex={[0]}
            allowToggle
          >
            {
              news.map((year, index) => (
                <AccordionItem
                  key={index}
                >
                  <AccordionButton
                    bg={"#bf9b5a"}
                    color={"white"}
                    _hover={{bg: "#bf9b5a"}}
                  >
                    <Box
                      as="span"
                      flex='1'
                      textAlign='left'
                    >
                      <Text
                        textAlign="center"
                        fontSize="2xl"
                      >
                        {
                          year.year === moment().year()
                            ? "Actual"
                            : year.year
                        }
                      </Text>
                    </Box>
                    <AccordionIcon/>
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    {
                      year.months.map((month, index) => (
                        <Box
                          key={index}
                        >
                          <Text
                            fontSize="2xl"
                            textAlign="center"
                            borderBottom="1px"
                            borderColor="gray.200"
                            pb={2}
                            mb={2}
                            textTransform="capitalize"
                            textDecoration={"underline"}
                          >
                            {
                              month.nameMonth
                            }
                          </Text>

                          <SimpleGrid
                            columns={{base: 1, md: 3}}
                            spacing={10}
                          >
                            {
                              month.news.map((item, index) => (
                                <Flex
                                  key={index}
                                  flexDirection="column"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Img
                                    src={item.cover_url}
                                    alt={item.date}
                                    w={250}
                                    cursor={"pointer"}
                                    onClick={() => router.push(`/news/${item.id}`)}
                                  />
                                  <Button
                                    my={5}
                                    onClick={() => router.push(`/news/${item.id}`)}
                                    bg={"#bf9b5a"}
                                    color={"white"}
                                    borderRadius={"full"}
                                    _hover={{bg: "#bf9b5a"}}
                                  >
                                    Leer periódico
                                  </Button>
                                </Flex>
                              ))
                            }
                          </SimpleGrid>
                        </Box>
                      ))
                    }
                  </AccordionPanel>
                </AccordionItem>
              ))
            }
          </Accordion>)
      }
    </LayoutSingle>
  );
}

export default News