import {Button, Flex, IconButton, Text, useColorModeValue, useToast} from "@chakra-ui/react";
import React from "react";
import {useRouter} from "next/router";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";

interface Props {
  onOpen: () => void;
  username: string
}

export const NavbarSidebar = ({onOpen, username}: Props) => {
  const router = useRouter()
  const toast = useToast()

  const onClickLogOut = async () => {
    const {data: {message}} = await axios.get("/api/v1/auth", {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
    toast({
      title: message,
      position: "top-right",
      status: "success",
      isClosable: true,
    })
    await router.push("/auth/login")
  }

  return (
    <Flex
      ml={{base: 0, md: 60}}
      px={{base: 4, md: 4}}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      justifyContent={{base: 'space-between', md: 'flex-end'}}
    >
      <IconButton
        display={{base: 'flex', md: 'none'}}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FontAwesomeIcon icon={faBars}/>}
      />

      <Flex
        w={"100%"}
        justifyContent="space-between"
        mx={{base: 2, md: 6}}
      >
        <Text textDecoration="underline" fontWeight="bold">Bienvenido {username}</Text>

        <Button
          variant={"link"}
          colorScheme={"blackAlpha.500"}
          onClick={onClickLogOut}
          pr={4}
        >
          Cerrar sesión
        </Button>
      </Flex>
    </Flex>
  );
};