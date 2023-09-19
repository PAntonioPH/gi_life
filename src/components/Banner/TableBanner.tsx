import {Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Image} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {LoadingPage} from "@/components/LoadingPage";
import {Banner} from "@/interfaces/Banner";

const columns = ["id", "Títutlo", "Imagen",]

export const TableBanner = () => {
  const router = useRouter();

  const [data, setData] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/v1/banner", {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(res => {
        setData(res.data.response);
        setLoading(false);
      })
  }, [])

  const handleClick = async (id: number) => await router.push(`/admin/banners/edit/${id}`)

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
                      <Td>{row.title}</Td>
                      <Td>
                        <Image
                          src={row.img}
                          alt={row.title}
                          h={10}
                        />
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