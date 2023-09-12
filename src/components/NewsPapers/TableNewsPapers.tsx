import {Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Image, Link} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {LoadingPage} from "@/components/LoadingPage";
import {News} from "@/interfaces/News";

const columns = ["id", "Fecha", "Portada", "Link"];

export const TableNewsPapers = () => {
  const router = useRouter();

  const [data, setData] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/v1/news", {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(res => {
        setData(res.data.response);
        setLoading(false);
      })
  }, [])

  const handleClick = async (id: number) => await router.push(`/admin/periodicos/edit/${id}`)

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
                      <Td>{row.date}</Td>
                      <Td>
                        <Image
                          src={row.cover_url}
                          alt={row.date}
                          width={70}
                        />
                      </Td>
                      <Td>
                        <Link
                          href={row.url}
                          isExternal
                          color="teal.500"
                        >
                          Ver Periodico
                        </Link>
                      </Td>
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