import {Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {LoadingPage} from "@/components/LoadingPage";
import process from "process";
import {Purchase} from "@/interfaces/Purchase";

const columns = ["id", "Estado", "Fecha", "Total"]

interface Props {
  shopping?: boolean
}

export const TablePurchase = ({shopping}: Props) => {
  const router = useRouter();

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

  const handleClick = async (id: number) => {
    if (shopping) {
      await router.push(`/admin/compras/${id}`)
    } else {
      await router.push(`/user/shopping/${id}`)
    }
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
                        {`${row.date_update} ${row.time_update}`}
                      </Td>
                      <Td>
                        $ {row.total.toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </Td>
                      {
                        shopping && (<Td>{row.username}</Td>)
                      }
                      <Td><Button colorScheme="red" variant="link" onClick={() => handleClick(row.id)}>Ver mas...</Button></Td>
                    </Tr>
                  ))
                }
              </Tbody>
            </Table>
          </TableContainer>)
      }
    </>
  )
}