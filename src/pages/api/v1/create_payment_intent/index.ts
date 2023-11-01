import {NextApiRequest, NextApiResponse} from "next";
import {message, validar_llaves, validate_cookie} from "@/utils/functions";
import Stripe from 'stripe';
import {conn} from "@/utils/database";

const {NEXT_PUBLIC_STRIPE_SECRET_KEY} = process.env

const stripe = new Stripe(NEXT_PUBLIC_STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', // Asegúrate de usar esta versión
});

const create_payment_intent = async (req: NextApiRequest, res: NextApiResponse) => {
  const {method, body} = req

  switch (method) {
    case "POST":
      try {
        const {email, username} = await validate_cookie(req, "tokenAuth")

        const keys_required = ["cart"]
        const validation = await validar_llaves(keys_required, body)

        if (!validation.success) return res.status(500).json(message(validation.message))

        const {cart} = body

        const responseCart = await conn.query(`SELECT id, price, discount
                                               FROM product
                                               WHERE id IN (${cart.map((item: any) => `'${item.id}'`).join(",")});`)

        responseCart.rows.forEach((item: any) => item.quantity = cart.find((cartItem: any) => cartItem.id === item.id).count)

        const amount = responseCart.rows.reduce((a: any, b: any) => a + (b.price * b.quantity) * (1 - b.discount / 100), 0);

        const customer = await stripe.customers.create({
          name: username as string,
          email: email as string,
        });

        const params: Stripe.PaymentIntentCreateParams = {
          amount: parseInt(amount) * 100,
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