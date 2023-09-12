import {Box, Button, Divider, Flex, Heading} from "@chakra-ui/react";
import {Sidebar} from "@/components/Sidebar/Sidebar";
import {TableUsers} from "@/components/Users/TableUsers";
import {useRouter} from "next/router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

const Usuarios = () => {
  const router = useRouter();

  return (
    <Sidebar title={"Usuarios"}>
      <Box pb={10}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading as="h1" size="lg">Usuarios</Heading>
          <Button
            onClick={() => router.push("/admin/usuarios/new")}
            colorScheme="blue"
            variant="solid"
            size="sm"
            mx={5}
            rightIcon={<FontAwesomeIcon icon={faPlus}/>}
          >
            Agregar Usuario
          </Button>
        </Flex>
        <Divider borderColor="black" borderWidth="1px"/>
      </Box>


      <TableUsers/>
    </Sidebar>
  )
}

export default Usuarios;