import {Box, Button, Divider, Flex, Heading} from "@chakra-ui/react";
import {Sidebar} from "@/components/Sidebar/Sidebar";
import {useRouter} from "next/router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {TableBanner} from "@/components/Banner/TableBanner";

const Banners = () => {
  const router = useRouter();

  return (
    <Sidebar title={"Banners"} >
      <Box pb={10}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading as="h1" size="lg">Banners</Heading>
          <Button
            onClick={() => router.push("/admin/banners/new")}
            colorScheme="blue"
            variant="solid"
            size="sm"
            mx={5}
            rightIcon={<FontAwesomeIcon icon={faPlus}/>}
          >
            Agregar Banner
          </Button>
        </Flex>
        <Divider borderColor="black" borderWidth="1px"/>
      </Box>

      <TableBanner/>
    </Sidebar>
  )
}

export default Banners;