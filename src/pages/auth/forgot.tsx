import {Box, Button, Center, FormHelperText, Container, FormControl, FormLabel, Heading, Input, Stack, useToast, VStack, HStack, PinInput, PinInputField, Flex} from '@chakra-ui/react'
import {Logo} from "@/components/Logo";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import axios from "axios";
import Head from "next/head";
import {useRouter} from "next/router";
import Cookies from "js-cookie";

const Login = () => {
  const router = useRouter()
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)

  const [dataForm, setDataForm] = useState({
    usernameEmail: "",
  })

  const [dataFormError, setDataFormError] = useState({
    usernameEmail: false,
  })

  const [verifyCode, setVerifyCode] = useState(false)

  const [dataVerifyCode, setDataVerifyCode] = useState({
    code: "",
    token: "",
    password: "",
  })

  useEffect(() => {
    Cookies.remove("user")
    Cookies.remove("tokenAuth")
  }, [])

  const handleChange = ({target: {value, name}}: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDataForm({
      ...dataForm,
      [name]: value
    });

    setDataFormError({...dataFormError, [name]: value.length === 0})
  }

  const handleChangePassword = ({target: {value, name}}: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDataVerifyCode({
      ...dataVerifyCode,
      [name]: value.trim()
    });
  }

  const handleVerifyCodeChange = (value: string) => {
    setDataVerifyCode({
      ...dataVerifyCode, ["code"]: value
    });
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setIsLoading(true)

    axios.post("/api/v1/forgot", {
      ...dataForm,
    }, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Usuario creado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });

        setDataVerifyCode({
          ...dataVerifyCode,
          token: res.data.response.token,
        })

        setVerifyCode(true)
      })
      .catch(err => {
        toast({
          title: "Error",
          description: err.response.data.message,
          status: "error",
          isClosable: true,
          position: "top-right"
        });
      })
      .finally(() => setIsLoading(false))
  }

  const handleVerifyCode = async (event: FormEvent) => {
    event.preventDefault()

    setIsLoading(true)

    axios.post("/api/v1/verify", {
      ...dataVerifyCode,
    }, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Usuario verificado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });

        await router.push("/auth/login")
      })
      .catch(err => {
        toast({
          title: "Error",
          description: err.response.data.message,
          status: "error",
          isClosable: true,
          position: "top-right"
        });
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <>
      <Head>
        <title>Crea tu cuenta</title>
        <link rel="shortcut icon" href="/assets/icons/favicon.ico"/>

        <meta property="og:title" content="GI Life"/>
        <meta property="og:type" content="website"/>
        <meta property="og:description" content="Gi Life"/>
        <meta property="og:url" content="https://gilife.com.mx/"/>
        <meta property="og:description" content="Gi Life"/>
        <meta property="og:image:width" content="600"/>
        <meta property="og:image:height" content="314"/>
        <meta property="og:image" content="https://gilife.com.mx//assets/icons/logoMeta.jpg"/>
        <meta property="og:image:type" content="image/jpeg"/>
        <meta property="og:image:type" content="image/png"/>
        <meta property="og:image:type" content="image/svg"/>
      </Head>

      <Container maxW="lg" mt={{base: '6', md: '12'}} py={{base: '12', md: '24'}} px={{base: '0', sm: '8'}}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Center><Logo/></Center>
            <Stack spacing={{base: '2', md: '3'}} textAlign="center">
              <Heading size={{base: 'xs', md: 'sm'}}>
                Olvidé mi contraseña
              </Heading>
            </Stack>
          </Stack>

          <Box
            py={{base: '10', sm: '8'}}
            px={{base: '4', sm: '10'}}
            borderRadius={{base: 'none', sm: 'xl'}}
            boxShadow={{base: 'none', sm: "dark-lg"}}
          >
            {
              !verifyCode
                ? (<form onSubmit={handleSubmit}>
                  <VStack
                    spacing={{base: 4, md: 8}}
                  >
                    <FormControl>
                      <FormLabel>Usuario o correo electrónico</FormLabel>
                      <Input name="usernameEmail" onChange={handleChange} value={dataForm.usernameEmail} type={"text"} borderColor={"blackAlpha.500"} isRequired/>
                      {dataFormError.usernameEmail && <FormHelperText color={"red"} fontSize={"sm"}>El usuario o correo electrónico no puede estar vacío</FormHelperText>}
                    </FormControl>
                  </VStack>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    mt={8}
                    isLoading={isLoading}
                  >
                    Verificar usuario
                  </Button>
                </form>)
                : (<form onSubmit={handleVerifyCode}>
                  <Heading
                    textAlign={"center"}
                    my={5}
                    size={"md"}
                  >
                    Ingresa el código que te enviamos a tu correo
                  </Heading>

                  <Flex
                    direction={"column"}
                    alignItems={"center"}
                  >
                    <HStack
                      mb={5}
                    >
                      <PinInput
                        onChange={handleVerifyCodeChange}
                        value={dataVerifyCode.code}
                      >
                        <PinInputField/>
                        <PinInputField/>
                        <PinInputField/>
                        <PinInputField/>
                        <PinInputField/>
                      </PinInput>
                    </HStack>

                    <FormControl>
                      <FormLabel>Nueva contraseña</FormLabel>
                      <Input name="password" onChange={handleChangePassword} value={dataVerifyCode.password} type={"text"} borderColor={"blackAlpha.500"} isRequired/>
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      mt={8}
                      isLoading={isLoading}
                    >
                      Actualizar contraseña
                    </Button>

                  </Flex>
                </form>)
            }
          </Box>
        </Stack>
      </Container>
    </>
  )
}

export default Login