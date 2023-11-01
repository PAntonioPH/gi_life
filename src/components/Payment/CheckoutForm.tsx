import {PaymentElement} from '@stripe/react-stripe-js'
import {FormEvent, useState} from 'react'
import {useStripe, useElements} from '@stripe/react-stripe-js';
import {Button, Text} from "@chakra-ui/react";

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const {error} = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occured.");
    }

    setIsLoading(false);
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