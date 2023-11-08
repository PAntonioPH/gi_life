import Head from "next/head";
import process from "process";
import {LayoutProduct} from "@/components/Layout/LayoutProduct";
import {Badge, Box, Button, Flex, Heading, HStack, Stack, Text, VStack} from "@chakra-ui/react";
import parse from "html-react-parser"
import {useRouter} from "next/router";
import {useCart} from "@/hooks/useCart";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartShopping, faCashRegister} from "@fortawesome/free-solid-svg-icons";
import ViewerImages from "@/components/Product/ViewerImages";

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
          boxShadow={"dark-lg"}
          borderRadius={"lg"}
          p={5}
          mt={5}
          direction={{base: "column", lg: "row"}}
        >
          <ViewerImages
            images={product.images}
          />

          <VStack
            w={{base: "100%", lg: "40%"}}
            px={5}
            borderRadius={"lg"}
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
            <Stack
              spacing={{base: 2, lg: 5}}
              direction={{base: "column", lg: "row"}}
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
              >
                Comprar Ahora
              </Button>
            </Stack>
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