import {Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {Category} from "@/interfaces/Category";
import {LoadingPage} from "@/components/LoadingPage";

const columns = ["id", "name", "father"];

export const TableCategories = () => {
  const router = useRouter();

  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/v1/categories", {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(res => {
        setData(res.data.response.filter((category: Category) => category.id !== 0));
        setLoading(false);
      })
  }, [])

  const handleClick = async (id: number) => await router.push(`/admin/categorias/edit/${id}`)

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
                      <Td>{row.father_name ? row.father_name : "-"}</Td>
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