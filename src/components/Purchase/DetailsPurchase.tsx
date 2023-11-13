import {Button, Image, Text, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {Purchase} from "@/interfaces/Purchase";
import axios from "axios";
import {LoadingPage} from "@/components/LoadingPage";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  shopping?: boolean;
  id: number;
}

export const DetailsPurchase = ({isOpen, onClose, shopping, id}: Props) => {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/v1/purchase/${id}`,
      {
        params: {
          time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}
      })
      .then(res => {
        setData(res.data.response)
      })
      .finally(() => setLoading(false))
  }, [id])

  return (<Modal
    isOpen={isOpen}
    onClose={onClose}
    isCentered
    motionPreset="slideInBottom"
    size="3xl"
  >
    <ModalOverlay/>
    <ModalContent>
      <ModalHeader>Detalles de la compra</ModalHeader>
      <ModalCloseButton/>
      {
        loading
          ? (<ModalBody>
            <LoadingPage/>
          </ModalBody>)
          : (<>
            <ModalBody>
              <SimpleGrid
                columns={{base: 1, md: 2}}
                spacing={4}
                mb={10}
              >
                <FormControl>
                  <FormLabel>Folio</FormLabel>
                  <Text>{data.id.toString().padStart(8, "0")}</Text>
                </FormControl>
                <FormControl>
                  <FormLabel>Fecha</FormLabel>
                  <Text>{data.date_time_update}</Text>
                </FormControl>
                {
                  shopping
                  && (<FormControl>
                    <FormLabel>Cliente</FormLabel>
                    <Text>{data.username}</Text>
                  </FormControl>)
                }
                <FormControl>
                  <FormLabel>Estatus</FormLabel>
                  <Text>{data.status}</Text>
                </FormControl>
                <FormControl>
                  <FormLabel>Total</FormLabel>
                  <Text>$ {data.total.toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
                </FormControl>
              </SimpleGrid>
              <TableContainer>
                <Table
                  variant='simple'
                  colorScheme='blackAlpha.500'
                >
                  <Thead>
                    <Tr>
                      <Th>Producto</Th>
                      <Th>Imagen</Th>
                      <Th>Cantidad</Th>
                      <Th>Precio</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {
                      data.purchase.map((row) => (
                        <Tr key={row.id}>
                          <Td>
                            {
                              row.name.length > 20
                                ? `${row.name.slice(0, 20)}...`
                                : row.name
                            }
                          </Td>
                          <Td>
                            <Image
                              src={row.images[0] || '/assets/images/placeholderImg.jpg'}
                              alt={row.name}
                              width={{base: "80px", md: "100"}}
                            />
                          </Td>
                          <Td>{row.count}</Td>
                          <Td>$ {(row.price * row.count * (1 - row.discount / 100)).toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Td>
                        </Tr>
                      ))
                    }
                  </Tbody>
                </Table>
              </TableContainer>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme='blue'
                mr={3}
                onClick={onClose}
              >
                Cerrar
              </Button>
            </ModalFooter>
          </>)
      }
    </ModalContent>
  </Modal>)
}