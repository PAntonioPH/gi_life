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

    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Image
        width="80%"
        src="/assets/images/404NotFound.png"
        alt="logo"
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