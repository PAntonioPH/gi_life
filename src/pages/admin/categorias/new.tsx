import {Sidebar} from "@/components/Sidebar/Sidebar";
import {Button, FormControl, FormHelperText, FormLabel, Input, Select, SimpleGrid, useDisclosure, useToast} from "@chakra-ui/react";
import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {faTrash, faArrowUpFromBracket, faSave} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ConfirmDialog} from "@/components/ConfirmDialog";
import {Category} from "@/interfaces/Category";
import {LoadingPage} from "@/components/LoadingPage";

const New = () => {
  const router = useRouter();
  const toast = useToast();
  const {isOpen, onOpen, onClose} = useDisclosure()

  const [dataForm, setDataForm] = useState({
    name: "",
    url: "",
    father: "",
  })

  const [dataFormError, setDataFormError] = useState({
    name: "",
    url: "",
  })

  const [fathers, setFathers] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get("/api/v1/categories", {
      params: {
        father: router.query.id ? router.query.id : true,
      },
      headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}
    })
      .then(res => {
        setFathers(res.data.response);
        setLoading(false);
      })
  }, [router.query])

  useEffect(() => {
    const loadData = (id: string) => {
      axios.get(`/api/v1/categories/${id}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
        .then(res => {
          setDataForm({name: res.data.response.name, father: res.data.response.father ? res.data.response.father : "", url: res.data.response.url})
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
    if (name === "url") value = value.toLowerCase().replace(/ /g, "_").replace(/[^\w-]+/g, "")
    if (name === "name") dataForm.url = value.toLowerCase().replace(/ /g, "_").replace(/[^\w-]+/g, "")

    setDataForm({...dataForm, [name]: value});
    setDataFormError({...dataFormError, [name]: value.length === 0})
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    axios.post("/api/v1/categories", dataForm, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Categoría creada",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
        await router.push("/admin/categorias");
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

  const handleUpdate = (id: string) => {
    setIsLoading(true);

    axios.put(`/api/v1/categories/${id}`, dataForm, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Categoría actualizado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
        await router.push("/admin/categorias");
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

    axios.delete(`/api/v1/categories/${id}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Categoría eliminado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
        await router.push("/admin/categorias");
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
    <Sidebar title={"Categoría"}>
      {
        loading
          ? (<LoadingPage/>)
          : (<form onSubmit={handleSubmit}>
            <SimpleGrid
              columns={{base: 1, md: 2}}
              spacing={{base: 4, md: 8}}
            >
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input name="name" onChange={handleChange} value={dataForm.name} type={"text"} borderColor={"blackAlpha.500"} isRequired/>
                {dataFormError.name && <FormHelperText color={"red"} fontSize={"sm"}>Este campo es obligatorio</FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel>URL</FormLabel>
                <Input name="url" onChange={handleChange} value={dataForm.url} type={"text"} borderColor={"blackAlpha.500"} isRequired/>
                {dataFormError.url && <FormHelperText color={"red"} fontSize={"sm"}>Este campo es obligatorio</FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel>Padre</FormLabel>
                <Select
                  placeholder='Elige una opción'
                  borderColor={"blackAlpha.500"}
                  value={dataForm.father}
                  name="father"
                  onChange={handleChange}
                >
                  {
                    fathers.map(father => (
                      <option key={father.id} value={father.id}>{father.name}</option>
                    ))
                  }
                </Select>
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
                    titleAlertDialog={"Eliminar Categoría"}
                    messageAlertDialog={"¿Está seguro que desea eliminar este categoría?"}
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