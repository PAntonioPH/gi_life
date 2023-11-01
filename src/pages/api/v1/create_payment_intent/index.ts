import {NextApiRequest, NextApiResponse} from "next";
import {message, validar_llaves} from "@/utils/functions";
import Stripe from 'stripe';

const {NEXT_PUBLIC_STRIPE_SECRET_KEY} = process.env

const stripe = new Stripe(NEXT_PUBLIC_STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', // Asegúrate de usar esta versión
});

const create_payment_intent = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, body} = req

  switch (method) {
    case "POST":
      try {
        const keys_required = ["customer_name", "customer_email", "amount", "cart"]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

        const {amount, customer_email, customer_name} = body

        const customer = await stripe.customers.create({
          name: customer_name,
          email: customer_email,
        });

        const params: Stripe.PaymentIntentCreateParams = {
          amount: parseInt(amount)*100,
          currency: 'MXN',
          automatic_payment_methods: {
            enabled: true,
          },
          customer: customer.id,
        }

        const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(
          params
        );

        return res.status(200).json(message("Intento de pago creado", paymentIntent))
      } catch (e) {
        return res.status(500).json(message("Error, al hacer el intento de pago"))
      }
    default:
      return res.status(400).json(message("Method not allowed"))
  }
}

export default create_payment_intent