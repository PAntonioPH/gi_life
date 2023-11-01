import {Box} from "@chakra-ui/react";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import {CheckoutForm} from "@/components/Payment/CheckoutForm";
import {useEffect, useState} from "react";
import axios from "axios";
import {LoadingPage} from "@/components/LoadingPage";
import {useCart} from "@/hooks/useCart";
import Cookies from "js-cookie";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

export const PaymentForm = () => {
  let cookie = Cookies.get("user");
  let user = cookie ? JSON.parse(cookie) : null;

  const {total, cart} = useCart()
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    axios.post('/api/v1/create_payment_intent', {
      cart: cart,
    }, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(res => {
        setClientSecret(res.data.response.client_secret);
      })
      .finally(() => setLoading(false));
  }, [cart, total, user.username, user.email]);

  return (<Box>
    {
      loading
        ? (<LoadingPage/>)
        : (clientSecret && stripePromise
          && (<Elements stripe={stripePromise} options={{clientSecret,}}>
            <CheckoutForm/>
          </Elements>))
    }
  </Box>)
}