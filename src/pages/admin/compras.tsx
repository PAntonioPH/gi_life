import {Box, Divider, Flex, Heading} from "@chakra-ui/react";
import {Sidebar} from "@/components/Sidebar/Sidebar";
import {TablePurchase} from "@/components/Purchase/TablePurchase";

const Compras = () => {
  return (
    <Sidebar title={"Compras"}>
      <Box pb={10}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading as="h1" size="lg">Compras</Heading>
        </Flex>
        <Divider borderColor="black" borderWidth="1px"/>
      </Box>

      <TablePurchase shopping={true}/>
    </Sidebar>
  )
}

export default Compras;