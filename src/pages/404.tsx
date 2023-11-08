import Head from "next/head";
import {Button, Center, Image, Box} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {useState} from "react";

const NotFound = () => {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    await router.push("/admin")
  }

  return (<>
    <Head>
      <title>Pagina no encontrada</title>
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

    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgGradient="linear(to-r, #a8b9e8, #e9b0d1, #f7b6c1)"
    >
      <Image
        width="40%"
        src="/assets/images/404NotFound.png"
        alt="logo"
        mb={10}
      />
      <Center>
        <Button
          onClick={handleClick}
          colorScheme="blue"
          isLoading={isLoading}
        >
          Ir al inicio
        </Button>
      </Center>
    </Box>
  </>);
};

export default NotFound;