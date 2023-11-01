import Head from "next/head";
import process from "process";
import {LayoutProduct} from "@/components/Layout/LayoutProduct";
import {Badge, Box, Button, Flex, Heading, HStack, SimpleGrid, Text, VStack} from "@chakra-ui/react";
import parse from "html-react-parser"
import {useRouter} from "next/router";
import {useCart} from "@/hooks/useCart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartShopping, faCashRegister} from "@fortawesome/free-solid-svg-icons";


interface Props {
  product: any
}

const Item = ({product}: Props) => {
  const router = useRouter();
  const {addProduct} = useCart()

  const handleBuyNow = async (product: any) => {
    addProduct(product)
    await router.push('/cart')
  }

  return (<>
      <Head>
        <title>{product.name} | GI Life</title>

        <link rel="shortcut icon" href="/assets/icons/favicon.ico"/>
        <meta property="og:title" content={product.name}/>
        <meta property="og:type" content="article"/>
        <meta property="og:description" content="Gi Life"/>
        <meta property="og:image:width" content="600"/>
        <meta property="og:image:height" content="314"/>
        <meta property="og:image" content={product.images[0] ? product.images[0] : "https://gilife.com.mx/assets/icons/logo.png"}/>
        <meta property="og:image:type" content="image/jpeg"/>
        <meta property="og:image:type" content="image/png"/>
      </Head>

      <LayoutProduct>
        <Flex
        >
          <SimpleGrid
            columns={2}
            w={"60%"}
          >
            <Box
              bg={"blue"}
            >
              hola
            </Box>

            <Box
              bg={"yellow"}
            >
              hola
            </Box>
          </SimpleGrid>

          <VStack
            w={"40%"}
            px={5}
            borderRadius={"lg"}
            boxShadow={"lg"}
            py={5}
          >
            <Heading
              size={"md"}
              textAlign={"justify"}
              pb={5}
            >
              {product.name}
            </Heading>

            {
              product.discount > 0
              && (<Badge
                  borderRadius='lg'
                  p={2}
                  colorScheme='teal'
                  color={"blackAlpha.700"}>
                  Descuento: {product.discount}%
                </Badge>)
            }

            <HStack
              spacing={10}
            >
              <Text
                fontSize={"md"}
                as={product.discount > 0 ? 'del' : "span"}
                color={product.discount > 0 ? "red" : "#00a650"}
              >
                ${(product.price).toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </Text>

              {
                product.discount > 0
                && (<Text
                  color={"#00a650"}
                  fontSize={"md"}
                >
                  ${(product.price - (product.price * product.discount) / 100).toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </Text>)
              }
            </HStack>
            <Text
              py={5}
              px={5}
              fontSize={"md"}
            >
              Disponibles: {product.stock}
            </Text>
            <Box
              textAlign={"justify"}
              pb={5}
              px={5}
            >
              {parse(product.description)}
            </Box>
            <HStack
              spacing={10}
            >
              <Button
                onClick={() => addProduct(product)}
                leftIcon={<FontAwesomeIcon icon={faCartShopping}/>}
                bg={"#c53030"}
                color={"white"}
                _hover={{
                  bg: "#c53030",
                  color: "white"
                }}
                boxShadow={"md"}
              >
                Añadir al carrito
              </Button>

              <Button
                onClick={() => handleBuyNow(product)}
                rightIcon={<FontAwesomeIcon icon={faCashRegister}/>}
                bg={"#00a650"}
                color={"white"}
                _hover={{
                  bg: "#00a650",
                  color: "white"
                }}
                boxShadow={"md"}
              >
                Comprar Ahora
              </Button>
            </HStack>
          </VStack>
        </Flex>
      </LayoutProduct>
    </>
  )
};

export async function getServerSideProps(context: any) {
  const {params: {item}} = context;

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/product/${item}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}});
  const {response} = await res.json();

  return {
    props: {
      product: response,
    },
  };
}

export default Item