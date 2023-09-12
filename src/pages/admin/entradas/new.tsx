import {Sidebar} from "@/components/Sidebar/Sidebar";
import {Button, Center, FormControl, FormLabel, Image, Input, Select, SimpleGrid, Textarea, useDisclosure, useToast} from "@chakra-ui/react";
import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {faTrash, faArrowUpFromBracket, faSave} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ConfirmDialog} from "@/components/ConfirmDialog";
import {LoadingPage} from "@/components/LoadingPage";
import {Category} from "@/interfaces/Category";
import {PostType} from "@/interfaces/PostType";

import {FilePond, registerPlugin} from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

import dynamic from "next/dynamic";
import SunEditorCore from "suneditor/src/lib/core";
import 'suneditor/dist/css/suneditor.min.css';

const SunEditor = dynamic(() => import("suneditor-react"), {ssr: false,});

const New = () => {
  const router = useRouter();
  const toast = useToast();
  const {isOpen, onOpen, onClose} = useDisclosure()

  const [dataForm, setDataForm] = useState({
    title: "",
    img: "",
    id_category: "",
    id_post_type: "1",
    title_rrss: "",
  })
  const [content, setContent] = useState("");
  const [image, setImage] = useState<any>([])
  const [image64, setImage64] = useState("")
  const [categories, setCategories] = useState<Category[]>([]);
  const [postTypes, setPostTypes] = useState<PostType[]>([]);

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get("/api/v1/categories", {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(res => {
        let categories = res.data.response.filter((category: Category) => category.id !== 0);
        const fatherCategory = categories.filter((category: Category) => category.father);

        fatherCategory.forEach((father: Category) => {
          const children = categories.filter((category: Category) => category.id === father.father);

          if (children.length > 0) categories = categories.filter((category: Category) => category.id !== children[0].id);
        })

        setCategories(categories);
      })

    axios.get("/api/v1/post_types", {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(res => {
        setPostTypes(res.data.response);
      })
      .finally(() => setLoading(false))

  }, []);

  useEffect(() => {
    const loadData = (id: string) => {
      axios.get(`/api/v1/posts/${id}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
        .then(res => {
          setDataForm(res.data.response);
          setContent(res.data.response.content);
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

  const handleChange = ({target: {value, name}}: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setDataForm({...dataForm, [name]: value})

    if (name === "id_category") {
      const category = categories.filter(category => category.id === parseInt(value))[0];
      if (category) setDataForm({...dataForm, [name]: value, title_rrss: `#${category.name} `})
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    axios.post("/api/v1/posts", {
      ...dataForm,
      content,
      file64: image64 != "" ? image64 : "data_null",
      fileName: image[0] ? image[0].file.name : null,
    }, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Entrada creado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
        await router.push("/admin/entradas");
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

    axios.put(`/api/v1/posts/${id}`, {
      ...dataForm,
      content,
      file64: image64 != "" ? image64 : "data_null",
      fileName: image[0] ? image[0].file.name : null,
    }, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Entrada actualizado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
        await router.push("/admin/entradas");
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

    axios.delete(`/api/v1/posts/${id}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Entrada eliminado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
        await router.push("/admin/entradas");
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

  const editor = useRef<SunEditorCore>();

  const getSunEditorInstance = (sunEditor: SunEditorCore) => editor.current = sunEditor;

  return (
    <Sidebar title={"Entrada"}>
      {
        loading
          ? (<LoadingPage/>)
          : (<form onSubmit={handleSubmit}>
            <SimpleGrid
              columns={1}
              spacing={{base: 4, md: 8}}
            >
              <FormControl>
                <FormLabel>Titulo</FormLabel>
                <Input name="title" onChange={handleChange} value={dataForm.title} type={"text"} borderColor={"blackAlpha.500"} isRequired/>
              </FormControl>
              <FormControl>
                <FormLabel>Imagen</FormLabel>
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
              <FormControl>
                <FormLabel>Contenido</FormLabel>
                <SunEditor
                  lang="es"
                  setContents={content}
                  getSunEditorInstance={getSunEditorInstance}
                  setOptions={{
                    buttonList: [
                      ['undo', 'redo'],
                      ['font', 'fontSize', 'formatBlock'],
                      ['paragraphStyle', 'blockquote'],
                      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                      ['fontColor', 'hiliteColor', 'textStyle'],
                      ['removeFormat'],
                      ['outdent', 'indent'],
                      ['align', 'horizontalRule', 'list', 'lineHeight'],
                      ['table', 'link', 'image', 'video', 'audio'],
                      ['fullScreen', 'showBlocks', 'codeView'],
                      ['preview', 'print'],
                    ]
                  }}
                  onChange={(content) => setContent(content)}
                />
              </FormControl>
              <SimpleGrid
                columns={{base: 1, md: 2}}
                spacing={4}
              >
                <FormControl>
                  <FormLabel>Categoría</FormLabel>
                  <Select name="id_category" onChange={handleChange} value={dataForm.id_category} borderColor={"blackAlpha.500"} isRequired>
                    <option value="">Selecciona una categoría</option>
                    {
                      categories.map(({id, name}, index) => (<option key={index} value={id}>{name}</option>))
                    }
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Tipo de entrada</FormLabel>
                  <Select name="id_post_type" onChange={handleChange} value={dataForm.id_post_type} borderColor={"blackAlpha.500"} isRequired>
                    {
                      postTypes.map(({id, name}, index) => (<option key={index} value={id}>{name}</option>))
                    }
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Titulo para RRSS</FormLabel>
                  <Textarea name="title_rrss" onChange={handleChange} value={dataForm.title_rrss} borderColor={"blackAlpha.500"} isRequired/>
                </FormControl>
              </SimpleGrid>
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
                    titleAlertDialog={"Eliminar Entrada"}
                    messageAlertDialog={"¿Está seguro que desea eliminar esta entrada?"}
                  />
                </>)
                :
                (<Button
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