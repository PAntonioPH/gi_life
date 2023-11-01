import {Layout} from "@/components/Layout/Layout";
import {Box, Button, Flex, Text} from "@chakra-ui/react";
import {useCart} from "@/hooks/useCart";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {PaymentForm} from "@/components/Payment/PaymentForm";

const Payment = () => {
  const router = useRouter()
  const {cart} = useCart()

  const [username, setUsername] = useState<string | null>("")

  useEffect(() => {
    let cookie = Cookies.get("user");
    let user = cookie ? JSON.parse(cookie) : null;

    if (user) setUsername(user.username)
  }, [])

  return (<Layout title="Pago">
    {
      username
        ? (<Flex
          direction={"column"}
          minH={"80vh"}
          justifyContent={"space-between"}
        >
          <Box>
            {
              cart.length > 0
                ? (<PaymentForm/>)
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
            Debes iniciar sesión para ver el pago
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

export default Payment;