import {Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {User} from "@/interfaces/User";
import axios from "axios";
import {useRouter} from "next/router";
import {LoadingPage} from "@/components/LoadingPage";

const columns = ["id", "username", "name", "email", "rol"]

export const TableUsers = () => {
  const router = useRouter();

  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/v1/users", {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(res => {
        setData(res.data.response);
        setLoading(false);
      })
  }, [])

  const handleClick = async (id: number) => await router.push(`/admin/usuarios/edit/${id}`)

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
                      <Td>{row.username}</Td>
                      <Td>{row.name}</Td>
                      <Td>{row.email}</Td>
                      <Td>{row.rol}</Td>
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