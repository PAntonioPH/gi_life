import {Box, Button, Center, Checkbox, Container, FormControl, FormLabel, Heading, HStack, Input, InputGroup, Stack, useToast,} from '@chakra-ui/react'
import {Logo} from "@/components/Logo";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import axios from "axios";
import Head from "next/head";
import {useRouter} from "next/router";
import Cookies from "js-cookie";

const Login = () => {
  const router = useRouter()
  const toast = useToast()

  const [form, setForm] = useState({
    username: "",
    password: "",
  })

  const {username, password} = form

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    axios.get("/api/v1/auth", {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(() => console.log("Sessión cerrada"))
      .catch(() => console.log("No hay token"))
    Cookies.remove("user")
  }, [])

  const handleChange = ({target}: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = target

    setForm({...form, [name]: value})
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setIsLoading(true)

    axios.post("/api/v1/auth", form, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async (response) => {
        toast({
          title: response.data.message,
          position: "top-right",
          status: "success",
          isClosable: true,
        })

        await router.push("/admin/dashboard")
      })
      .catch(() => {
        toast({
          title: "Usuario o contraseña incorrectas",
          position: "top-right",
          status: "error",
          isClosable: true,
        })
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <>
      <Head>
        <title>Login</title>
        <link rel="shortcut icon" href="/assets/icons/favicon.ico"/>

        <meta property="og:title" content="La Opinión del Altiplano"/>
        <meta property="og:type" content="website"/>
        <meta property="og:description" content="El alma de la noticia"/>
        <meta property="og:url" content="https://laopiniondelaltiplano.com"/>
        <meta property="og:description" content="El alma de la noticia"/>
        <meta property="og:image:width" content="600"/>
        <meta property="og:image:height" content="314"/>
        <meta property="og:image" content="https://laopiniondelaltiplano.com/assets/icons/logoMeta.jpg"/>
        <meta property="og:image:type" content="image/jpeg"/>
        <meta property="og:image:type" content="image/png"/>
        <meta property="og:image:type" content="image/svg"/>
      </Head>

      <Container maxW="lg" mt={{base: '6', md: '12'}} py={{base: '12', md: '24'}} px={{base: '0', sm: '8'}}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Center><Logo/></Center>
            <Stack spacing={{base: '2', md: '3'}} textAlign="center">
              <Heading size={{base: 'xs', md: 'sm'}}>Iniciar sesión</Heading>
            </Stack>
          </Stack>
          <Box
            py={{base: '10', sm: '8'}}
            px={{base: '4', sm: '10'}}
            borderRadius={{base: 'none', sm: 'xl'}}
            boxShadow={{base: 'none', sm: "dark-lg"}}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing="6">
                <Stack spacing="5">
                  <FormControl>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input
                      borderColor={"black"}
                      focusBorderColor={"black"}
                      _hover={{borderColor: "black"}}
                      id={"username"}
                      name={"username"}
                      type={"text"}
                      value={username}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <InputGroup>
                      <Input
                        borderColor={"black"}
                        focusBorderColor={"black"}
                        _hover={{borderColor: "black"}}
                        id={"password"}
                        name={"password"}
                        type={'password'}
                        autoComplete={"current-password"}
                        value={password}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </FormControl>
                </Stack>
                <HStack justify="space-between">
                  <Checkbox colorScheme={"red"} defaultChecked>Remember me</Checkbox>
                </HStack>
                <Stack spacing="6">
                  <Button
                    type={"submit"}
                    colorScheme={"blue"}
                    isLoading={isLoading}
                  >Sign in</Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Container>
    </>
  )
}

export default Login