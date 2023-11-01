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
  console.log(product)

  const handleBuyNow = async (product: any) => {
    addProduct(product)
    await router.push('/cart')
  }

  return (<>
      <Head>
        <title>{product.title}</title>

        <link rel="shortcut icon" href="/assets/icons/favicon.ico"/>
        <meta property="og:title" content={product.title}/>
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
              size={"lg"}
              textAlign={"justify"}
              px={5}
            >
              {product.name}
            </Heading>

            {
              product.discount > 0
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
                  colorScheme='teal'
                  color={"blackAlpha.700"}>
                  Descuento:
                </Badge>
                <Text
                  as={"b"}
                  mx={2}
                  fontSize={"lg"}
                  color={"darkred"}
                >
                  {product.discount}%
                </Text>
              </Flex>)
            }

            <HStack>
              <Text
                borderRadius={"lg"}
                boxShadow={product.discount > 0 ? 'none' : "outline"}
                px={5}
                my={2}
                fontSize={"lg"}
                as={product.discount > 0 ? 'del' : "span"}
                color={product.discount > 0 ? "red" : "#00a650"}
              >
                ${(product.price).toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </Text>

              {
                product.discount > 0
                && (<Text
                  px={5}
                  borderRadius={"lg"}
                  color={"#00a650"}
                  fontSize={"lg"}
                  boxShadow={product.discount > 0 ? 'outline' : "none"}
                >
                  ${(product.price - (product.price * product.discount) / 100).toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </Text>)
              }
            </HStack>
            <Text
              borderRadius={"lg"}
              boxShadow={"lg"}
              py={5}
              px={5}
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