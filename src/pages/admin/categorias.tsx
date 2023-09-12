import {Box, Button, Divider, Flex, Heading} from "@chakra-ui/react"
import {Sidebar} from "@/components/Sidebar/Sidebar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {TableCategories} from "@/components/Categories/TableCategories";

const Categories = () => {
  const router = useRouter();

  return (
    <Sidebar title={"Categorías"}>
      <Box pb={10}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading as="h1" size="lg">Categorías</Heading>
          <Button
            onClick={() => router.push("/admin/categorias/new")}
            colorScheme="blue"
            variant="solid"
            size="sm"
            mx={5}
            rightIcon={<FontAwesomeIcon icon={faPlus}/>}
          >
            Agregar categoría
          </Button>
        </Flex>
        <Divider borderColor="black" borderWidth="1px"/>
      </Box>


      <TableCategories/>
    </Sidebar>
  )
}

export default Categories