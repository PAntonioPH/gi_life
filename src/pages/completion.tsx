import {Box, Flex, Heading, HStack, Image, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack} from "@chakra-ui/react";
import {Layout} from "@/components/Layout/Layout";
import {useCart} from "@/hooks/useCart";
import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import process from "process";
import {LoadingPage} from "@/components/LoadingPage";
import {Purchase} from "@/interfaces/Purchase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartArrowDown} from "@fortawesome/free-solid-svg-icons";


const Completion = () => {


  const {clearCart} = useCart()
  const router = useRouter()

  const clearCartRef = useRef(clearCart);

  const {payment_intent, redirect_status} = router.query

  const [data, setData] = useState<Purchase>({
    id: 0,
    date_time_update: "",
    username: "",
    time_update: "",
    date_update: "",
    id_user: 0,
    status: "",
    total: 0,
    purchase: [],
    id_purchase_stripe: "",
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!payment_intent) return;

    axios.get(`/api/v1/purchase/${payment_intent}`,
      {
        params: {
          time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          completion: true
        },
        headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}
      })
      .then(res => {
        setData(res.data.response)
        console.log(res.data.response)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => setLoading(false))

    if (payment_intent && redirect_status && redirect_status === "succeeded" && payment_intent !== "") {
      clearCartRef.current();
    }

  }, [payment_intent, redirect_status])

  return (<Layout title="Pago completado">
    {
      loading
        ? (<LoadingPage/>)
        : (<Flex
          direction={"column"}
          bgGradient="linear(to-b, #00a650, white, white)"
          borderRadius={"lg"}
          py={10}
        >

          <VStack
            py={10}
            px={5}
          >
            <FontAwesomeIcon fontSize="4rem" icon={faCartArrowDown} color={"white"}/>
            <Heading
              color={"#f4f9ff"}
            >
              Compra Finalizada
            </Heading>
          </VStack>

          <TableContainer
            px={5}
          >

            <Table
              variant={'striped'}
              mt={5}
            >

              <Thead bg={"white"}>
                <Tr>
                  <Th>
                    Nombre del Producto
                  </Th>
                  <Th>
                    Producto
                  </Th>
                  <Th>
                    Cantidad
                  </Th>
                  <Th>
                    Precio
                  </Th>
                  <Th>
                    Total
                  </Th>
                </Tr>
              </Thead>

              <Tbody>
                {
                  data.purchase.map(({id, name, images, count, discount, price}) => (
                    <Tr
                      key={id}
                    >
                      <Td>
                        {
                          name.slice(0, 30)
                        }
                        {
                          name.length > 30
                          && "..."
                        }
                      </Td>
                      <Td>
                        <Image
                          src={images[0] || '/assets/images/placeholderImg.jpg'}
                          alt={"Producto"}
                          borderRadius={"lg"}
                          w={"70px"}
                          h={"70px"}
                        />
                      </Td>
                      <Td>
                        {count}
                      </Td>
                      <Td>
                        <HStack>
                          <Text
                            fontSize={"md"}
                            as={discount > 0 ? 'del' : "span"}
                          >
                            $ {price.toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </Text>

                          {
                            discount > 0
                            && (<Text
                              fontSize={"md"}
                            >
                              $ {(price - (price * discount) / 100).toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </Text>)
                          }
                        </HStack>
                      </Td>
                      <Td>
                        $ {(price * count * (1 - discount / 100)).toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </Td>
                    </Tr>
                  ))
                }
              </Tbody>
            </Table>
          </TableContainer>

          <Flex
            justifyContent={"flex-end"}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              mt={5}
              mr={10}
            >
              Total pagado: $ {(data.total).toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </Text>
          </Flex>

          <Box
            px={5}
            py={5}
          >
            <Box
              boxShadow={"lg"}
              borderRadius={"lg"}
              py={10}
              px={5}
              mt={5}
              borderLeft={"6px solid #00347f"}
              bg={"#f5f5f5"}
              textAlign={"center"}
            >
              <Heading
                size={"md"}
              >
                La entrega estimada de tu paquete es:
              </Heading>
              <Heading
                size={"md"}
              >
                fecha
              </Heading>
            </Box>
          </Box>
        </Flex>)
    }
  </Layout>)
}

export default Completion