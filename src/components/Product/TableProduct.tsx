import {Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {LoadingPage} from "@/components/LoadingPage";
import {Product} from "@/interfaces/Product";

const columns = ["id", "Nombre", "Precio", "Descuento", "Total", "Cantidad", "Categoría"]

export const TableProduct = () => {
  const router = useRouter();

  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/v1/product", {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(res => {
        setData(res.data.response);
        setLoading(false);
      })
  }, [])

  const handleClick = async (id: number) => await router.push(`/admin/productos/edit/${id}`)

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
                  <Th>Opciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {
                  data.map((row) => (
                    <Tr key={row.id}>
                      <Td>{row.id}</Td>
                      <Td>{row.name}</Td>
                      <Td>$ {row.price.toLocaleString()}</Td>
                      <Td>{row.discount} %</Td>
                      <Td>$ {(row.price - (row.price * (row.discount / 100))).toLocaleString()}</Td>
                      <Td>{row.stock.toLocaleString()}</Td>
                      <Td>{row.category}</Td>
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