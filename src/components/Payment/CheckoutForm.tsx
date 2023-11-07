import {PaymentElement} from '@stripe/react-stripe-js'
import {FormEvent, useState} from 'react'
import {useStripe, useElements} from '@stripe/react-stripe-js';
import {Button, Text} from "@chakra-ui/react";
import {StripeError} from "@stripe/stripe-js";
import Stripe from "stripe";
import axios from "axios";
import process from "process";
import {useCart} from "@/hooks/useCart";
import {useRouter} from "next/router";

export const CheckoutForm = () => {
  const {cart} = useCart()
  const router = useRouter()
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const {error, paymentIntent} = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
      redirect: "if_required"
    }) as { error?: StripeError, paymentIntent?: Stripe.PaymentIntent };


    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }

      setIsLoading(false);
    } else if (paymentIntent) {
      axios.post('api/v1/purchase',
        {
          cart,
          time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          id_purchase_stripe: paymentIntent.id
        },
        {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}}
      )
        .then(() => {
          router.push(`/completion?payment_intent=${paymentIntent.id}&redirect_status=${paymentIntent.status}`)
        })
        .catch(err => {
          setMessage(err.response.data.message)
        })
        .finally(() => setIsLoading(false))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement/>

      <Button
        type={"submit"}
        color={"white"}
        colorScheme={"red"}
        isLoading={isLoading}
        disabled={isLoading || !stripe || !elements}
        mt={4}
      >
        Pagar ahora
      </Button>

      <Text mt={4} color={"red.500"}>{message}</Text>
    </form>
  )
}