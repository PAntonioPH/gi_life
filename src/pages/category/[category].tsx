import {useRouter} from "next/router";
import {Layout} from "@/components/Layout/Layout";
import {useEffect, useState} from "react";
import {Badge, Flex, Heading, HStack, Image, SimpleGrid, Text, VStack} from "@chakra-ui/react";
import {Product} from "@/interfaces/Product";
import axios from "axios";
import {Pagination} from "@/components/Pagination";
import {LoadingPage} from "@/components/LoadingPage";


const Category = () => {
  const router = useRouter()
  const [data, setData] = useState<Product[]>([])

  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const {category} = router.query

  useEffect(() => {
    if (!category) return;

    axios.get(`/api/v1/product?category=${category}&page=${currentPage}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then((res) => {
        if (res.data.response.product.length > 0) setData(res.data.response.product.sort((a: Product, b: Product) => b.id - a.id))
        setTotalPages(res.data.response.total)
      })
      .finally(() => setLoading(false))
  }, [category, currentPage]);
  const handleClick = async (id: number) => await router.push(`/category/${category}/item/${id}`)

  return (
    <Layout
      title={typeof category === "string" ? `${category[0].toUpperCase()}${category.slice(1, category.length)} | GI Life` : "category | GI Life"}
    >
      {
        loading
          ? (<LoadingPage/>)
          : (<>
            <Flex
              justifyContent={"center"}
              mt={10}
            >
              <SimpleGrid
                columns={3}
                spacing={10}
              >
                {
                  data.map(({id, images, discount, name, price}) => (
                    <Flex
                      direction={"column"}
                      key={id}
                      boxShadow={"lg"}
                      borderRadius={"lg"}
                      cursor={"pointer"}
                      _hover={{
                        bg: "blackAlpha.200",
                      }}
                      p={2}
                    >
                      <Image
                        src={images[0] && images[0] != "" ? images[0] : "/assets/images/placeholderImg.jpg"}
                        alt={"Producto"}
                        onClick={() => handleClick(id)}
                        borderRadius={"lg"}
                        h={"300px"}
                        w={"450px"}
                        objectFit={"cover"}
                      />

                      <VStack
                        spacing={3}
                        mt={2}
                      >
                        <Heading
                          size={"md"}
                          textAlign={"justify"}
                        >
                          {
                            name.slice(0, 40)
                          }
                          {
                            name.length > 40
                            && "..."
                          }
                        </Heading>

                        {
                          discount > 0
                          && (<Badge
                            borderRadius='lg'
                            px='2'
                            py={2}
                            colorScheme='teal'>
                            Descuento: {discount}%
                          </Badge>)
                        }

                        <HStack>
                          <Text
                            fontSize={"md"}
                            as={discount > 0 ? 'del' : "span"}
                            color={discount > 0 ? 'red' : "black"}
                          >
                            $ {price.toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </Text>

                          {
                            discount > 0
                            && (<Text
                              color={"#00a650"}
                              fontSize={"md"}
                            >
                              $ {(price - (price * discount) / 100).toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </Text>)
                          }
                        </HStack>
                      </VStack>
                    </Flex>
                  ))
                }
              </SimpleGrid>
            </Flex>
            {
              totalPages > 0
                ? (<Pagination
                  total={totalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />)
                : (<Flex
                  direction={"column"}
                  alignItems={"center"}
                >
                  <Heading>
                    Aún no hay publicaciones en esta categoría
                  </Heading>
                  <Image
                    mt={5}
                    src={"/assets/images/placeholderImg.jpg"}
                    alt={"404"}
                    w={"50%"}
                  />

                </Flex>)
            }
          </>)
      }
    </Layout>
  )
}

export default Category;