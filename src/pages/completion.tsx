import {Box, Heading} from "@chakra-ui/react";
import {Layout} from "@/components/Layout/Layout";
import {useCart} from "@/hooks/useCart";
import {useEffect, useRef} from "react";
import {useRouter} from "next/router";

const Completion = () => {
  const {clearCart} = useCart()
  const router = useRouter()

  const clearCartRef = useRef(clearCart);

  const {payment_intent, redirect_status} = router.query

  useEffect(() => {
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