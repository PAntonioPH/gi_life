import {useRouter} from "next/router";
import {Layout} from "@/components/Layout/Layout";
import {useEffect, useState} from "react";
import {Badge, Box, Flex, Heading, Image, SimpleGrid, Text} from "@chakra-ui/react";
import {Product} from "@/interfaces/Product";
import axios from "axios";
import product from "@/pages/api/v1/product";
import {image} from "suneditor/src/plugins";

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
        console.log(res.data.response.product)
      })
      .finally(() => setLoading(false))
  }, [category, currentPage]);
  const handleClick = async (id: number) => await router.push(`/category/${category}/item/${id}`)

  return (
    <Layout
      title={typeof category === "string" ? `${category[0].toUpperCase()}${category.slice(1, category.length)}` : "category"}
    >
      <Flex>
        <SimpleGrid
          columns={3}
          spacing={10}
        >
          {
            data.map(({id, images, discount, name, price, description}) => (
              <Flex
                direction={"column"}
                key={id}
                boxShadow={"lg"}

              >
                <Image
                  src={images[0] && images[0] != "" ? images[0] : "/assets/images/placeholderImg.jpg"}
                  alt={"Producto"}
                  cursor={"pointer"}
                  onClick={() => handleClick(id)}
                  borderRadius={"lg"}

                  // px={5}
                  // py={5}
                  // w={"cover"}
                  // h={"400px"}
                />

                <Heading
                  size={"md"}
                  px={5}
                  my={5}
                >
                  {
                    name
                  }
                </Heading>

                {
                  price &&
                  (<>
                      <Text
                        px={5}
                      >
                        Precio:
                      </Text>
                      <Text
                      color={"#2db66f"}
                      >
                        <Text
                          as={'del'}
                          color={"red"}
                          px={5}
                        >
                          ${price}</Text> || ${price - (price * discount) / 100}
                      </Text>
                    </>
                  )
                }

                {discount > 0
                  && (<>
                    <Flex
                      direction={"row"}
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
                        mx={2}
                      >
                        {discount}%
                      </Text>
                    </Flex>
                  </>)
                }
                <Text
                  px={5}
                >
                  {description}
                </Text>
              </Flex>
            ))
          }
        </SimpleGrid>
      </Flex>
    </Layout>
  )
}

export default Category;