import {Box, Button, Divider, Flex, Heading} from "@chakra-ui/react"
import {Sidebar} from "@/components/Sidebar/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {TablePosts} from "@/components/Posts/TablePosts";

const Entradas = () => {
    const router = useRouter();

  return (
    <Sidebar title={"Entradas"}>
      <Box pb={10}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading as="h1" size="lg">Entradas</Heading>
          <Button
            onClick={() => router.push("/admin/entradas/new")}
            colorScheme="blue"
            variant="solid"
            size="sm"
            mx={5}
            rightIcon={<FontAwesomeIcon icon={faPlus}/>}
          >
            Agregar Entrada
          </Button>
        </Flex>
        <Divider borderColor="black" borderWidth="1px"/>
      </Box>


      <TablePosts/>
    </Sidebar>
  )
}

export default Entradas