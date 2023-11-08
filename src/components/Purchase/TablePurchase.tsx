import {Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {LoadingPage} from "@/components/LoadingPage";
import process from "process";
import {Purchase} from "@/interfaces/Purchase";
import {DetailsPurchase} from "@/components/Purchase/DetailsPurchase";

const columns = ["id", "Estado", "Fecha", "Total"]

interface Props {
  shopping?: boolean
}

export const TablePurchase = ({shopping}: Props) => {
  const {isOpen, onOpen, onClose} = useDisclosure()

  const [currentPurchase, setCurrentPurchase] = useState(0)
  const [data, setData] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/v1/purchase',
      {
        params: {
          time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          shopping: true
        },
        headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}
      })
      .then(res => {
        setData(res.data.response)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleClick = (id: number) => {
    setCurrentPurchase(id)
    onOpen()
  }

  return (
    <>
      {
        loading
          ? (<LoadingPage/>)
          : (<TableContainer>
            <Table
              variant='simple'
              colorScheme='blackAlpha.500'
            >
              <Thead>
                <Tr>
                  {
                    columns.map((column) => (
                      <Th key={column}>{column}</Th>
                    ))
                  }
                  {
                    shopping && (<Th>Cliente</Th>)
                  }
                  <Th>Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {
                  data.map((row) => (
                    <Tr key={row.id}>
                      <Td>{row.id}</Td>
                      <Td>{row.status}</Td>
                      <Td>
                        {`${row.date_time_update}`}
                      </Td>
                      <Td>
                        $ {row.total.toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </Td>
                      {
                        shopping && (<Td>{row.username}</Td>)
                      }
                      <Td><Button colorScheme="red" variant="link" onClick={() => handleClick(row.id)}>Ver</Button></Td>
                    </Tr>
                  ))
                }
              </Tbody>
            </Table>
          </TableContainer>)
      }

      {
        (isOpen && currentPurchase > 0)
        && (<DetailsPurchase
          isOpen={isOpen}
          onClose={onClose}
          shopping={shopping}
          id={currentPurchase}
        />)
      }
    </>
  )
}