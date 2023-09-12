import {Box, Card, CardBody, Text, Divider, Flex, Heading, Image, SimpleGrid, Stack} from "@chakra-ui/react";

interface Post {
  category: string,
  id: number,
  id_category: number,
  img?: string,
  title: string
}

interface Categories {
  id: number,
  name: string,
  posts: Post[]
}

interface Props {
  dataCategories: Categories[]
  handleClickCategory: (name: string) => void
  handleClickPost: (category: string, id: number) => void
}

export const GridHome = ({dataCategories, handleClickCategory, handleClickPost}: Props) => {
  return (<Box>
    {
      dataCategories
      && (dataCategories.map(({id, name, posts}) =>
        <Box
          key={id}
          pb={10}
        >
          <Flex
            onClick={() => handleClickCategory(name)}
            pb={5}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Divider
              marginX={4}
              borderColor="#a02142"
              borderWidth="1px"
            />
            <Heading
              size={"lg"}
              textDecoration={"underline"}
              w={"500px"}
              _hover={{
                cursor: "pointer",
              }}
              textAlign={"center"}
            >
              {name}
            </Heading>
            <Divider
              marginX={4}
              borderColor="#a02142"
              borderWidth="1px"
            />
          </Flex>

          <Flex
            bg={"#6a1834"}
            onClick={() => handleClickPost(posts[0].category, posts[0].id)}
            h={"400px"}
            borderRadius={"md"}
            boxShadow={"dark-lg"}
            cursor={"pointer"}
          >
            <Flex
              w={{md: "25%", base: "100%"}}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Text
                color={"white"}
                fontSize={{md: "2xl", base: "xl"}}
                textAlign={"center"}
                p={5}
              >
                {posts[0].title}
              </Text>
            </Flex>

            <Flex
              w={{md: "75%", base: "100%"}}
              bgImage={posts[0].img && posts[0].img != "" ? `url(${posts[0].img})` : `url(/assets/images/placeholderImg.jpg)`}
              bgSize={"cover"}
              bgPosition={"center"}
              bgRepeat={"no-repeat"}
              borderRadius={"md"}
            ></Flex>
          </Flex>

          <SimpleGrid
            pt={5}
            spacing={{md: 10, base: 5}}
            columns={{md: 3, base: 1}}
          >
            {
              posts.slice(1, 4).map(({id, title, img, category}) =>
                <Card
                  key={id}
                  direction={{base: 'column', sm: 'row'}}
                  overflow='hidden'
                  variant='outline'
                  height={{base: 'auto', sm: '200px'}}
                  boxShadow='dark-lg'
                  borderRadius='md'
                  onClick={() => handleClickPost(category, id)}
                  cursor={"pointer"}
                >
                  <Image
                    objectFit='cover'
                    maxW={{base: '100%', sm: '150px'}}
                    src={img && img != "" ? img : "/assets/images/placeholderImg.jpg"}
                    alt={title}
                  />

                  <Stack>
                    <CardBody>
                      <Heading
                        size='xs'
                        color='#6a1834'
                      >
                        {title}
                      </Heading>
                    </CardBody>
                  </Stack>
                </Card>
              )
            }
          </SimpleGrid>
        </Box>
      ))

    }
  </Box>)
}