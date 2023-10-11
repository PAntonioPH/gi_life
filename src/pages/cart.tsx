import {Layout} from "@/components/Layout/Layout";
import {Box, Button, Flex, Text} from "@chakra-ui/react";
import {CartList} from "@/components/Cart/CartList";
import {useCart} from "@/hooks/useCart";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";

const Cart = () => {
  const router = useRouter()
  const {total, cart} = useCart()

  const [username, setUsername] = useState<string | null>("")

  useEffect(() => {
    let cookie = Cookies.get("user");
    let user = cookie ? JSON.parse(cookie) : null;

    if (user) setUsername(user.username)
  }, [])


  return (<Layout title="Carro de compras">
    {
      username
        ? (<Flex
          direction={"column"}
          minH={"80vh"}
          justifyContent={"space-between"}
        >
          <Box
          >
            <CartList/>
            {
              cart.length === 0
              && (<Flex
                justifyContent="center"
                alignItems="center"
                direction="column"
                h={"70vh"}
              >
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  mt={5}
                >
                  No hay productos en el carro
                </Text>

                <Button
                  colorScheme="red"
                  mt={5}
                  onClick={() => router.push("/")}
                >
                  Ir a comprar
                </Button>
              </Flex>)
            }
          </Box>

          {
            cart.length > 0
            && (<Flex
              direction="column"
              alignItems="end"
            >
              <Text
                fontSize="2xl"
                fontWeight="bold"
                mt={5}
              >
                Total: $ {total}
              </Text>

              <Button
                colorScheme="red"
                mt={5}
              >
                Pagar
              </Button>
            </Flex>)
          }
        </Flex>)
        : (<Flex
          justifyContent="center"
          alignItems="center"
          direction="column"
          h={"70vh"}
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            mt={5}
          >
            Debes iniciar sesión para ver el carro
          </Text>

          <Button
            colorScheme="red"
            mt={5}
            onClick={() => router.push("/auth/login")}
          >
            Iniciar sesión
          </Button>
        </Flex>)
    }
  </Layout>)
}

export default Cart;