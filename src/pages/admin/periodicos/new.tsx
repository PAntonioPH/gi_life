import {Sidebar} from "@/components/Sidebar/Sidebar";
import {Button, FormControl, FormHelperText, FormLabel, Input, SimpleGrid, Image, useDisclosure, useToast, Center, Textarea} from "@chakra-ui/react";
import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {faTrash, faSave} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ConfirmDialog} from "@/components/ConfirmDialog";
import {LoadingPage} from "@/components/LoadingPage";
import moment from "moment";

import {FilePond, registerPlugin} from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

const New = () => {
  const router = useRouter();
  const toast = useToast();
  const {isOpen, onOpen, onClose} = useDisclosure()

  const [dataForm, setDataForm] = useState({
    date: moment().format("YYYY-MM-DD"),
    url: "",
    cover_url: "",
    news_embed: "",
  })

  const [dataFormError, setDataFormError] = useState({
    date: "",
    url: "",
    news_embed: "",
  })

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [coverImage, setCoverImage] = useState<any>([])
  const [coverImage64, setImagen64] = useState("")

  useEffect(() => {
    const loadData = (id: string) => {
      setLoading(true);

      axios.get(`/api/v1/news/${id}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
        .then(res => {
          setDataForm(res.data.response);
        })
        .catch(err => {
          toast({
            title: "Error",
            description: err.response.data.message,
            status: "error",
            duration: 5000
          })
        })
        .finally(() => setLoading(false))
    }

    if (router.query.id && typeof router.query.id === "string") loadData(router.query.id);
  }, [router.query, toast])

  const handleChange = ({target: {value, name}}: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDataForm({...dataForm, [name]: value});
    setDataFormError({...dataFormError, [name]: value.length === 0})
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!coverImage[0]) {
      toast({
        title: "Error",
        description: "Debe seleccionar una imagen de portada",
        status: "error",
        duration: 5000
      });
      return
    }

    setIsLoading(true);

    axios.post("/api/v1/news", {
      ...dataForm,
      cover: coverImage64,
      coverName: coverImage[0] ? coverImage[0].file.name : "",
    }, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Periodico creado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
        await router.push("/admin/periodicos");
      })
      .catch(err => {
        setIsLoading(false);

        toast({
          title: "Error",
          description: err.response.data.message,
          status: "error",
          isClosable: true,
          position: "top-right"
        });
      })
  }

  const handleDelete = (id: string) => {
    setIsLoading(true);

    axios.delete(`/api/v1/news/${id}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Periodico eliminado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
        await router.push("/admin/periodicos");
      })
      .catch(err => {
        setIsLoading(false);

        toast({
          title: "Error",
          description: err.response.data.message,
          status: "error",
          isClosable: true,
          position: "top-right"
        });
      })
  }

  const handleChangeImagen = (files: any) => {
    setCoverImage(files)

    if (!files[0]) return

    const file = files[0].file;
    const reader = new FileReader();

    reader.onloadend = () => {
      if (!reader.result) return;
      const base64String = (reader.result as string).split(',')[1];
      setImagen64(base64String)
    };

    reader.readAsDataURL(file);
  }

  return (
    <Sidebar title={"Periódico"}>
      {
        loading
          ? (<LoadingPage/>)
          : (<form onSubmit={handleSubmit}>
            <SimpleGrid
              columns={{base: 1, md: 2}}
              spacing={{base: 4, md: 8}}
              pb={4}
            >
              <FormControl>
                <FormLabel>Fecha</FormLabel>
                <Input name="date" onChange={handleChange} value={dataForm.date} type={"date"} borderColor={"blackAlpha.500"} isRequired/>
                {dataFormError.date && <FormHelperText color={"red"} fontSize={"sm"}>La fecha es requerida</FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel>URL</FormLabel>
                <Input name="url" onChange={handleChange} value={dataForm.url} type={"url"} borderColor={"blackAlpha.500"} isRequired/>
                {dataFormError.url && <FormHelperText color={"red"} fontSize={"sm"}>La URL es requerida</FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel>Periodico</FormLabel>
                <Textarea name="news_embed" onChange={handleChange} value={dataForm.news_embed} borderColor={"blackAlpha.500"} isRequired/>
                {dataFormError.news_embed && <FormHelperText color={"red"} fontSize={"sm"}>El periodico es requerido</FormHelperText>}
              </FormControl>

              {
                (router.query.id && typeof router.query.id === "string")
                  ? (<>
                    <FormControl>
                    </FormControl>
                    <FormControl>
                      <Center>
                        <Image
                          src={dataForm.cover_url}
                          alt={"Portada"}
                          width={256}
                        />
                      </Center>
                    </FormControl>
                    <FormControl>
                      <embed
                        src={dataForm.url}
                        type="application/pdf"
                        width="100%"
                        height="400px"
                      />
                    </FormControl>
                  </>)
                  : (<>
                    <FormControl>
                      <FormLabel>Imagen de Portada</FormLabel>
                      <FilePond
                        files={coverImage}
                        onupdatefiles={(updatedFiles) => handleChangeImagen(updatedFiles)}
                        maxFiles={1}
                        labelIdle='Arrastra y suelta el archivo o <span class="filepond--label-action">selecciona</span>'
                        acceptedFileTypes={['image/png', 'image/jpeg',]}
                        allowImagePreview={true}
                        imagePreviewMaxHeight={256}
                      />
                    </FormControl>
                  </>)
              }
            </SimpleGrid>

            {
              (router.query.id && typeof router.query.id === "string")
                ? (<>
                  <Button
                    colorScheme={"red"}
                    ml={5}
                    onClick={onOpen}
                    isLoading={isLoading}
                    rightIcon={<FontAwesomeIcon icon={faTrash}/>}
                  >
                    Eliminar
                  </Button>
                  <ConfirmDialog
                    isOpen={isOpen}
                    onConfirm={handleDelete}
                    id={router.query.id}
                    onClose={onClose}
                    buttonAlertDialog={"Eliminar"}
                    titleAlertDialog={"Eliminar Periodico"}
                    messageAlertDialog={"¿Está seguro que desea eliminar este periodico?"}
                  />
                </>)
                : (<Button
                  type={"submit"}
                  colorScheme={"green"}
                  my={5}
                  isLoading={isLoading}
                  rightIcon={<FontAwesomeIcon icon={faSave}/>}
                >
                  Guardar
                </Button>)
            }
          </form>)
      }
    </Sidebar>
  )
}

export default New;