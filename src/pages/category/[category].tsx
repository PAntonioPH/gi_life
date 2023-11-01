import {useRouter} from "next/router";
import {Layout} from "@/components/Layout/Layout";
import {useEffect, useState} from "react";
import {Badge, Flex, Heading, HStack, Image, SimpleGrid, Text} from "@chakra-ui/react";
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
                    >
                      <Image
                        src={images[0] && images[0] != "" ? images[0] : "/assets/images/placeholderImg.jpg"}
                        alt={"Producto"}
                        cursor={"pointer"}
                        onClick={() => handleClick(id)}
                        borderRadius={"lg"}
                        h={"300px"}
                        w={"450px"}
                        objectFit={"cover"}
                      />

                      <Heading
                        px={5}
                        my={2}
                        size={"md"}
                        textAlign={"justify"}
                      >
                        {
                          name.slice(0, 85)
                        }
                        {
                          name.length > 85
                          && "..."
                        }
                      </Heading>

                      {
                        discount > 0
                        && (<Flex
                          direction={"row"}
                          alignItems={"center"}
                          px={5}
                          my={2}
                        >
                          <Badge
                            borderRadius='lg'
                            px='2'
                            py={2}
                            colorScheme='teal'>
                            Descuento:
                          </Badge>
                          <Text
                            as={"b"}
                            mx={2}
                            fontSize={"lg"}
                            color={"#ff7300"}
                          >
                            {discount}%
                          </Text>
                        </Flex>)
                      }

                      <HStack>

                        <Text
                          px={5}
                          my={2}
                          fontSize={"lg"}
                          as={discount > 0 ? 'del' : "span"}
                          color={discount > 0 ? 'red' : "black"}
                        >
                          $ {price.toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </Text>

                        {
                          discount > 0
                          && (<Text
                            color={"#00a650"}
                            fontSize={"lg"}
                          >
                            $ {(price - (price * discount) / 100).toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </Text>)
                        }
                      </HStack>
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