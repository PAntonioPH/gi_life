import {Sidebar} from "@/components/Sidebar/Sidebar";
import {Button, Text, FormControl, FormHelperText, FormLabel, Input, Image, SimpleGrid, useDisclosure, useToast, Select, Flex, HStack} from "@chakra-ui/react";
import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
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


import dynamic from "next/dynamic";
import SunEditorCore from "suneditor/src/lib/core";
import 'suneditor/dist/css/suneditor.min.css';
import {Category} from "@/interfaces/Category";
import {LoadingPage} from "@/components/LoadingPage";

const SunEditor = dynamic(() => import("suneditor-react"), {ssr: false,});

const New = () => {
  const router = useRouter();
  const toast = useToast();
  const {isOpen, onOpen, onClose} = useDisclosure()

  const [dataForm, setDataForm] = useState({
    images: [],
    name: "",
    price: 0,
    discount: 0,
    stock: 0,
    id_category: "",
  })

  const [dataFormError, setDataFormError] = useState({
    name: false,
    price: false,
    discount: false,
    stock: false,
  })

  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const [image, setImage] = useState<any>([])
  const [image64, setImage64] = useState<string[]>([])

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
      .finally(() => setLoading(false))
  }, []);

  useEffect(() => {
    const loadData = (id: string) => {
      axios.get(`/api/v1/product/${id}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
        .then(res => {
          setDataForm(res.data.response);
          setContent(res.data.response.description);
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
    switch (name) {
      case "discount":
        setDataForm({...dataForm, [name]: isNaN(parseInt(value)) ? 0 : (parseInt(value) > 100 ? 100 : parseInt(value))});
        return;
    }
    setDataForm({...dataForm, [name]: value});
    setDataFormError({...dataFormError, [name]: value.length === 0})
  }

  const handleChangeImage = (files: any) => {
    setImage(files);

    if (files.length === 0) {
      setImage64([]);
      return;
    }

    const promises = files.map((file: any) => {
      return new Promise<{ file64: string; fileName: string }>((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          if (!reader.result) {
            reject(new Error('No result'));
            return;
          }

          const base64String = (reader.result as string).split(',')[1];
          resolve({file64: base64String, fileName: file.filename});
        };

        reader.onerror = () => {
          reject(new Error('File reading error'));
        };

        reader.readAsDataURL(file.file);
      });
    });

    Promise.all(promises)
      .then((tempImage64) => {
        setImage64(tempImage64);
      })
      .catch((error) => {
        console.error('File reading error:', error);
      });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    axios.post("/api/v1/product", {
      ...dataForm,
      description: content,
      files: image64,
    }, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Producto creado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
        await router.push("/admin/productos");
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

    axios.put(`/api/v1/product/${id}`, {
      ...dataForm,
      description: content,
      files: image64,
    }, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Producto actualizado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
        await router.push("/admin/productos");
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

    axios.delete(`/api/v1/product/${id}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Producto eliminado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
        await router.push("/admin/productos");
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

  const editor = useRef<SunEditorCore>();
  const getSunEditorInstance = (sunEditor: SunEditorCore) => editor.current = sunEditor;

  return (
    <Sidebar title={"Productos"}>
      {
        loading
          ? (<LoadingPage/>)
          : (<form onSubmit={handleSubmit}>
            <SimpleGrid
              columns={1}
              spacing={{base: 4, md: 8}}
            >
              <SimpleGrid
                columns={{base: 1, md: 3}}
                spacing={{base: 4, md: 8}}
              >
                <FormControl>
                  <FormLabel>Nombre</FormLabel>
                  <Input name="name" onChange={handleChange} value={dataForm.name} type={"text"} borderColor={"blackAlpha.500"} isRequired/>
                  {dataFormError.name && (<FormHelperText color={"red.500"}>Este campo es requerido</FormHelperText>)}
                </FormControl>
                <FormControl>
                  <FormLabel>Cantidad</FormLabel>
                  <Input name="stock" onChange={handleChange} value={dataForm.stock > 0 ? dataForm.stock : ""} type={"number"} borderColor={"blackAlpha.500"} isRequired/>
                  {dataFormError.stock && (<FormHelperText color={"red.500"}>Este campo es requerido</FormHelperText>)}
                </FormControl>
                <FormControl>
                  <FormLabel>Categoría</FormLabel>
                  <Select name="id_category" onChange={handleChange} value={dataForm.id_category} borderColor={"blackAlpha.500"} isRequired>
                    <option value="">Selecciona una categoría</option>
                    {
                      categories.map(({id, name}, index) => (<option key={index} value={id}>{name}</option>))
                    }
                  </Select>
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <SunEditor
                  lang="es"
                  setContents={content}
                  getSunEditorInstance={getSunEditorInstance}
                  setOptions={{
                    buttonList: [
                      ['undo', 'redo'],
                      ['font', 'fontSize', 'formatBlock'],
                      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                      ['fontColor', 'hiliteColor', 'textStyle'],
                      ['removeFormat'],
                      ['outdent', 'indent'],
                      ['align', 'horizontalRule', 'list', 'lineHeight'],
                    ]
                  }}
                  onChange={(content) => setContent(content)}
                />
              </FormControl>
              <SimpleGrid
                columns={{base: 1, md: 3}}
                spacing={{base: 4, md: 8}}
              >
                <FormControl>
                  <FormLabel>Precio</FormLabel>
                  <Input name="price" onChange={handleChange} value={dataForm.price > 0 ? dataForm.price : ""} type={"number"} borderColor={"blackAlpha.500"} isRequired placeholder={"$0.00"}/>
                  {dataFormError.price && (<FormHelperText color={"red.500"}>Este campo es requerido</FormHelperText>)}
                </FormControl>
                <FormControl>
                  <FormLabel>Descuento</FormLabel>
                  <Input name="discount" onChange={handleChange} value={dataForm.discount > 0 ? dataForm.discount : ""} type={"number"} borderColor={"blackAlpha.500"} placeholder={"0%"}/>
                  {dataFormError.discount && (<FormHelperText color={"red.500"}>Este campo es requerido</FormHelperText>)}
                </FormControl>
                <FormControl>
                  <FormLabel>Total</FormLabel>
                  <Text>
                    {
                      dataForm.price
                        ? `$${(dataForm.price - (dataForm.price * (dataForm.discount / 100))).toFixed(2)}`
                        : "$0.00"
                    }
                  </Text>
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>Producto</FormLabel>
                <FilePond
                  files={image}
                  onupdatefiles={(updatedFiles) => handleChangeImage(updatedFiles)}
                  maxFiles={6}
                  labelIdle='Arrastra y suelta tus archivos o <span class="filepond--label-action">selecciona</span>'
                  acceptedFileTypes={['image/png', 'image/jpeg',]}
                  allowImagePreview={true}
                  allowMultiple={true}
                  imagePreviewMaxHeight={256}
                />
                <HStack
                  spacing={4}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  {
                    dataForm.images.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={dataForm.name}
                        objectFit={"cover"}
                        height={"200px"}
                      />
                    ))
                  }
                </HStack>
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
                    titleAlertDialog={"Eliminar Producto"}
                    messageAlertDialog={"¿Está seguro que desea eliminar este producto?"}
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