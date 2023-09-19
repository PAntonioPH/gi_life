import {Sidebar} from "@/components/Sidebar/Sidebar";
import {Button, Center, FormControl, FormHelperText, FormLabel, Input, Image, SimpleGrid, useDisclosure, useToast} from "@chakra-ui/react";
import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {faTrash, faArrowUpFromBracket, faSave} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ConfirmDialog} from "@/components/ConfirmDialog";
import {FilePond, registerPlugin} from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';


const New = () => {
  const router = useRouter();
  const toast = useToast();
  const {isOpen, onOpen, onClose} = useDisclosure()

  const [dataForm, setDataForm] = useState({
    title: "",
    img: "",
  })

  const [dataFormError, setDataFormError] = useState({
    title: "",
  })

  const [image, setImage] = useState<any>([])
  const [image64, setImage64] = useState("")

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = (id: string) => {
      axios.get(`/api/v1/banner/${id}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
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
    }

    if (router.query.id && typeof router.query.id === "string") loadData(router.query.id);
  }, [router.query, toast]);

  const handleChange = ({target: {value, name}}: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDataForm({...dataForm, [name]: value});
    setDataFormError({...dataFormError, [name]: value.length === 0})
  }

  const handleChangeImage = (files: any) => {
    setImage(files)

    if (!files[0]) return

    const file = files[0].file;
    const reader = new FileReader();

    reader.onloadend = () => {
      if (!reader.result) return;

      const base64String = (reader.result as string).split(',')[1];
      setImage64(base64String)
    };

    reader.readAsDataURL(file);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (image64 === "") {
      toast({
        title: "Error",
        description: "Debe subir una imagen",
        status: "error",
        isClosable: true,
        position: "top-right"
      });
      return;
    }

    setIsLoading(true);

    axios.post("/api/v1/banner", {
      ...dataForm,
      file64: image64 != "" ? image64 : "data_null",
      fileName: image[0] ? image[0].file.name : null,
    }, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Banner creado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
        await router.push("/admin/banners");
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

  const handleUpdate = (id: string) => {
    setIsLoading(true);

    axios.put(`/api/v1/banner/${id}`, {
      ...dataForm,
      file64: image64 != "" ? image64 : "data_null",
      fileName: image[0] ? image[0].file.name : null,
    }, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Banner actualizado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
        await router.push("/admin/banners");
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

  const handleDelete = (id: string) => {
    setIsLoading(true);

    axios.delete(`/api/v1/banner/${id}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Banner eliminado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
        await router.push("/admin/banners");
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

  return (
    <Sidebar title={"Banners"}>
      {
        <form onSubmit={handleSubmit}>
          <SimpleGrid
            columns={{base: 1, md: 2}}
            spacing={{base: 4, md: 8}}
          >
            <FormControl>
              <FormLabel>Titulo</FormLabel>
              <Input name="title" onChange={handleChange} value={dataForm.title} type={"text"} borderColor={"blackAlpha.500"} isRequired/>
              {dataFormError.title && (<FormHelperText color={"red.500"}>Este campo es requerido</FormHelperText>)}
            </FormControl>
            <FormControl>
              <FormLabel>Banner</FormLabel>
              <SimpleGrid
                columns={dataForm.img && dataForm.img !== "" ? 2 : 1}
                spacing={4}
              >
                <FilePond
                  files={image}
                  onupdatefiles={(updatedFiles) => handleChangeImage(updatedFiles)}
                  maxFiles={1}
                  labelIdle='Arrastra y suelta tus archivos o <span class="filepond--label-action">selecciona</span>'
                  acceptedFileTypes={['image/png', 'image/jpeg',]}
                  allowImagePreview={true}
                  imagePreviewMaxHeight={256}
                />
                {
                  dataForm.img && dataForm.img !== ""
                  && (<Center>
                    <Image
                      src={dataForm.img}
                      alt={dataForm.title}
                      height={{base: 256, md: 120}}
                    />
                  </Center>)
                }
              </SimpleGrid>
            </FormControl>
          </SimpleGrid>

          {
            (router.query.id && typeof router.query.id === "string")
              ? (<>
                <Button
                  colorScheme={"green"}
                  my={5}
                  onClick={() => typeof router.query.id === "string" && handleUpdate(router.query.id)}
                  isLoading={isLoading}
                  rightIcon={<FontAwesomeIcon icon={faArrowUpFromBracket}/>}
                >
                  Actualizar
                </Button>
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
                  titleAlertDialog={"Eliminar Banner"}
                  messageAlertDialog={"¿Está seguro que desea eliminar este banner?"}
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
        </form>
      }
    </Sidebar>
  )
}

export default New;