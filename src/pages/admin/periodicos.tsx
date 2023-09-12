import {Box, Button, Divider, Flex, Heading} from "@chakra-ui/react";
import {Sidebar} from "@/components/Sidebar/Sidebar";
import {useRouter} from "next/router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {TableNewsPapers} from "@/components/NewsPapers/TableNewsPapers";

const Usuarios = () => {
  const router = useRouter();

  return (
    <Sidebar title={"Periódico"}>
      <Box pb={10}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading as="h1" size="lg">Periódicos</Heading>
          <Button
            onClick={() => router.push("/admin/periodicos/new")}
            colorScheme="blue"
            variant="solid"
            size="sm"
            mx={5}
            rightIcon={<FontAwesomeIcon icon={faPlus}/>}
          >
            Agregar Periódico
          </Button>
        </Flex>
        <Divider borderColor="black" borderWidth="1px"/>
      </Box>

      <TableNewsPapers/>
    </Sidebar>
  )
}

export default Usuarios;