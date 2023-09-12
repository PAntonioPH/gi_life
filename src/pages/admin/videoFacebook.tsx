import {Box, Button, Divider, Flex, FormControl, FormLabel, Heading, Input, SimpleGrid, Stack, Textarea, useToast} from "@chakra-ui/react";
import {Sidebar} from "@/components/Sidebar/Sidebar";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import axios from "axios";
import {LoadingPage} from "@/components/LoadingPage";
import parse from "html-react-parser";


const resizeIframe = (url: string, newWidth: string, newHeight: string) => url.replace(/width=['"](\d+)['"]\s+height=['"](\d+)['"]|height=['"](\d+)['"]\s+width=['"](\d+)['"]/g, `width='${newWidth}' height='${newHeight}'`)

const getDimensions = (url: string) => url.match(/width='(\d+)'\s*height='(\d+)'/)

const Usuarios = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [id, setId] = useState<number>(1)

  const [widthHeight, setWidthHeight] = useState({
    width: "",
    height: ""
  })

  const [dataForm, setDataForm] = useState({
    title: "",
    url: "",
  })

  useEffect(() => {
    setIsLoading(true)
    axios.get(`/api/v1/video_facebook?id=${id}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(res => {
        setDataForm(res.data.response)

        const match = getDimensions(res.data.response.url)

        if (match) {
          setWidthHeight({
            width: match[1],
            height: match[2]
          })
        }
      })
      .finally(() => setIsLoading(false))
  }, [id])

  const handleChange = ({target: {name, value}}: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    value = value.replaceAll(/"/g, "'")

    setDataForm({
      ...dataForm,
      [name]: value
    })

    if (name === "url") {
      const match = getDimensions(value)

      if (match) {
        setWidthHeight({
          width: match[1],
          height: match[2]
        })
      }
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true)

    axios.post("/api/v1/video_facebook", {
      title: dataForm.title,
      url: resizeIframe(dataForm.url, widthHeight.width, widthHeight.height),
      id
    }, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(res => {
        toast({
          title: "Video Facebook",
          description: res.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      })
      .catch(err => {
        toast({
          title: "Error",
          description: err.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      })
      .finally(() => setLoading(false))
  }

  return (
    <Sidebar title={"Video FB"}>
      <Box pb={10}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading as="h1" size="lg">Video Facebook</Heading>
        </Flex>
        <Divider borderColor="black" borderWidth="1px"/>
      </Box>

      {
        isLoading
          ? (<LoadingPage/>)
          : (<>
            <Stack
              direction={"row"}
              alignItems="center"
              justifyContent="center"
              mb={5}
            >
              <Button
                colorScheme={id === 1 ? "teal" : "red"}
                isActive={id === 1}
                onClick={() => setId(1)}
                variant={id === 1 ? "solid" : "outline"}
              >
                Diario
              </Button>
              <Button
                colorScheme={id === 2 ? "teal" : "red"}
                isActive={id === 2}
                onClick={() => setId(2)}
                variant={id === 2 ? "solid" : "outline"}
              >
                Semanal
              </Button>
              <Button
                colorScheme={id === 3 ? "teal" : "red"}
                isActive={id === 3}
                onClick={() => setId(3)}
                variant={id === 3 ? "solid" : "outline"}
              >
                Entrevista
              </Button>
            </Stack>

            <form onSubmit={handleSubmit}>
              <SimpleGrid
                columns={{base: 1, md: 2}}
                spacing={10}
                mt={5}
              >
                <FormControl>
                  <FormLabel>Titulo</FormLabel>
                  <Input type="text" borderColor={"blackAlpha.500"} isRequired value={dataForm.title} name="title" onChange={handleChange}/>
                </FormControl>
                <FormControl>
                  <FormLabel>URL</FormLabel>
                  <Textarea borderColor={"blackAlpha.500"} isRequired value={dataForm.url} name="url" onChange={handleChange}/>
                </FormControl>
                {
                  dataForm.url && dataForm.url !== ""
                  && (<>
                    <FormControl>
                      <FormLabel>Dimensiones (Ancho - Alto)</FormLabel>
                      <Flex
                        justifyContent="space-evenly"
                        alignItems="center"
                      >
                        <Input type="number" borderColor={"blackAlpha.500"} isRequired value={widthHeight.width} name="width" onChange={({target: {name, value}}) => setWidthHeight({...widthHeight, [name]: value})} w={20}/>
                        <Input type="number" borderColor={"blackAlpha.500"} isRequired value={widthHeight.height} name="height" onChange={({target: {name, value}}) => setWidthHeight({...widthHeight, [name]: value})} w={20}/>
                      </Flex>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Video</FormLabel>
                      <Flex
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                      >
                        {(parse(resizeIframe(dataForm.url, widthHeight.width, widthHeight.height)))}
                      </Flex>
                    </FormControl>
                  </>)
                }
              </SimpleGrid>

              <Button
                colorScheme="green"
                leftIcon={<FontAwesomeIcon icon={faSave}/>}
                type="submit"
                mt={5}
                isLoading={loading}
              >
                Guardar
              </Button>
            </form>
          </>)
      }
    </Sidebar>
  )
}

export default Usuarios;