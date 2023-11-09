import {Box, Heading} from "@chakra-ui/react";
import {Layout} from "@/components/Layout/Layout";
import {useCart} from "@/hooks/useCart";
import {useEffect, useRef} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import process from "process";

const Completion = () => {
  const {clearCart} = useCart()
  const router = useRouter()

  const clearCartRef = useRef(clearCart);

  const {payment_intent, redirect_status} = router.query

  useEffect(() => {
    axios.get(`/api/v1/purchase/${payment_intent}`,
      {
        params: {
          time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          completion: true
        },
        headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}
      })
      .then(res => {
        console.log(res.data.response)
      })
      .catch(err => {
        console.log(err)
      })

    if (payment_intent && redirect_status && redirect_status === "succeeded" && payment_intent !== "") {
      clearCartRef.current();
    }

  }, [payment_intent, redirect_status])

  return (<Layout title="Pago completado">
    <Box>
      <Heading>
        Pago completado
      </Heading>
    </Box>
  </Layout>)
}

export default Completion