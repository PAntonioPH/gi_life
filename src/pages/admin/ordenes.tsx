import {Box, Divider, Flex, Heading} from "@chakra-ui/react";
import {Sidebar} from "@/components/Sidebar/Sidebar";

const Productos = () => {
  return (
    <Sidebar title={"Ordenes"}>
      <Box pb={10}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading as="h1" size="lg">Ordenes</Heading>
        </Flex>
        <Divider borderColor="black" borderWidth="1px"/>
      </Box>
    </Sidebar>
  )
}

export default Productos;