import {Box, Button, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import axios from "axios";

export const ControlUser = () => {
  const router = useRouter()
  const [username, setUsername] = useState<string | null>("")

  useEffect(() => {
    let cookie = Cookies.get("user");
    let user = cookie ? JSON.parse(cookie) : null;

    if (user) setUsername(user.username)
  }, [])

  const onClickLogOut = async () => {
    try {
      await axios.get("/api/v1/auth", {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
    } catch (e) {
      console.log(e)
    }

    Cookies.remove("user")
    location.reload();
  }

  return (<Box>
    {
      username
        ? (<Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            textDecoration={"underline"}
            _hover={{
              bg: "transparent",
            }}
            _active={{
              bg: "transparent",
            }}
          >
            Hola, {username}
          </MenuButton>
          <MenuList>
            <MenuItem
              onClick={() => router.push("/user/compras")}
            >
              Mis compras
            </MenuItem>
            <MenuItem
              onClick={() => router.push("/user/perfil")}
            >
              Mis datos
            </MenuItem>
            <MenuItem
              onClick={onClickLogOut}
            >
              Cerrar sesión
            </MenuItem>
          </MenuList>
        </Menu>)
        : (<Button
          onClick={() => router.push("/auth/login")}
          variant='outline'
          px={5}
        >
          Iniciar sesión
        </Button>)
    }
  </Box>)
}