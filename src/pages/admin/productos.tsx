import {Box, Button, Divider, Flex, Heading} from "@chakra-ui/react";
import {Sidebar} from "@/components/Sidebar/Sidebar";
import {useRouter} from "next/router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {TableProduct} from "@/components/Product/TableProduct";

const Productos = () => {
  const router = useRouter();

  return (
    <Sidebar title={"Productos"}>
      <Box pb={10}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading as="h1" size="lg">Productos</Heading>
          <Button
            onClick={() => router.push("/admin/productos/new")}
            colorScheme="blue"
            variant="solid"
            size="sm"
            mx={5}
            rightIcon={<FontAwesomeIcon icon={faPlus}/>}
          >
            Agregar Producto
          </Button>
        </Flex>
        <Divider borderColor="black" borderWidth="1px"/>
      </Box>

      <TableProduct/>
    </Sidebar>
  )
}

export default Productos;