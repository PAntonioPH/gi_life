import {Button, Flex, FormControl, FormLabel, Heading, Input, SimpleGrid} from "@chakra-ui/react";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import {CheckoutForm} from "@/components/Payment/CheckoutForm";
import React, {ChangeEvent, useEffect, useState} from "react";
import axios from "axios";
import {LoadingPage} from "@/components/LoadingPage";
import {useCart} from "@/hooks/useCart";
import Cookies from "js-cookie";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

export const PaymentForm = () => {
  let cookie = Cookies.get("user");
  let user = cookie ? JSON.parse(cookie) : null;

  const {total, cart} = useCart()
  const [loadingStripe, setLoadingStripe] = useState(true);
  const [loadingDirection, setLoadingDirection] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [dataDirection, setDataDirection] = useState({
    country: "",
    state: "",
    municipality: "",
    neighborhood: "",
    postal_code: "",
    street: "",
  });
  const [step, setStep] = useState(1);

  const handleChange = ({target: {value, name}}: ChangeEvent<HTMLInputElement>) => {
    let tempValue = value;

    switch (name) {
      case "postal_code":
        if (value.length > 5) tempValue = value.slice(0, 5);
        break;
      default:
        tempValue = value;
    }

    setDataDirection({...dataDirection, [name]: tempValue});
  }

  const handleCreatePaymentIntent = () => {
    setStep(2)

    axios.post('/api/v1/create_payment_intent', {
      cart: cart,
    }, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(res => {
        setClientSecret(res.data.response.client_secret);
      })
      .finally(() => setLoadingStripe(false));
  }

  useEffect(() => {
    axios.get('/api/v1/user_address',
      {
        params: {
          time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          shopping: true
        },
        headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}
      })
      .then(res => {
        setDataDirection(res.data.response)
      })
      .finally(() => setLoadingDirection(false))
  }, [cart, total, user.username, user.email]);

  return (<Flex
    justifyContent={"center"}
    alignItems={"center"}
    mt={10}
    direction={"column"}
  >
    <Flex
      direction={"column"}
    >
      <Heading
        size={"lg"}
        mb={5}
        cursor={"pointer"}
        onClick={() => setStep(1)}
        textDecoration={"underline"}
      >
        Dirección de envío
      </Heading>

      {
        step === 1
        && (<>
          {
            loadingDirection
              ? (<LoadingPage quantity={2}/>)
              : (<>
                <SimpleGrid columns={{base: 1, md: 2}} spacing={10}>
                  <FormControl>
                    <FormLabel>País</FormLabel>
                    <Input type="text" name="country" value={dataDirection.country} onChange={handleChange} borderColor={"blackAlpha.500"} isRequired/>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Estado</FormLabel>
                    <Input type="text" name="state" value={dataDirection.state} onChange={handleChange} borderColor={"blackAlpha.500"} isRequired/>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Municipio</FormLabel>
                    <Input type="text" name="municipality" value={dataDirection.municipality} onChange={handleChange} borderColor={"blackAlpha.500"} isRequired/>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Colonia</FormLabel>
                    <Input type="text" name="neighborhood" value={dataDirection.neighborhood} onChange={handleChange} borderColor={"blackAlpha.500"} isRequired/>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Código Postal</FormLabel>
                    <Input type="number" name="postal_code" value={dataDirection.postal_code} onChange={handleChange} borderColor={"blackAlpha.500"} isRequired/>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Calle</FormLabel>
                    <Input type="text" name="street" value={dataDirection.street} onChange={handleChange} borderColor={"blackAlpha.500"} isRequired/>
                  </FormControl>
                </SimpleGrid>

                <Button
                  colorScheme={"green"}
                  my={5}
                  onClick={() => handleCreatePaymentIntent()}
                >
                  Siguiente
                </Button>
              </>)
          }
        </>)
      }
    </Flex>

    {
      step === 2
      && (<Flex
        direction={"column"}
        ml={10}
      >
        <Heading
          size={"lg"}
          mb={5}
          textDecoration={"underline"}
        >
          Información de pago
        </Heading>

        {
          loadingStripe
            ? (<LoadingPage/>)
            : (clientSecret && stripePromise
              && (<Elements stripe={stripePromise} options={{clientSecret,}}>
                <CheckoutForm/>
              </Elements>))
        }
      </Flex>)
    }
  </Flex>)
}