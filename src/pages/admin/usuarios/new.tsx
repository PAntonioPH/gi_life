import {Sidebar} from "@/components/Sidebar/Sidebar";
import {Button, FormControl, FormHelperText, FormLabel, Input, Select, SimpleGrid, useDisclosure, useToast} from "@chakra-ui/react";
import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import axios from "axios";
import {Role} from "@/interfaces/Role";
import {useRouter} from "next/router";
import {faTrash, faArrowUpFromBracket, faSave} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ConfirmDialog} from "@/components/ConfirmDialog";
import {LoadingPage} from "@/components/LoadingPage";

const New = () => {
  const router = useRouter();
  const toast = useToast();
  const {isOpen, onOpen, onClose} = useDisclosure()

  const [dataForm, setDataForm] = useState({
    username: "",
    password: "",
    name: "",
    last_name: "",
    email: "",
    id_rol: ""
  })

  const [dataFormError, setDataFormError] = useState({
    username: false,
    password: false,
    name: false,
    last_name: false,
    email: false,
    id_rol: false
  })

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get("/api/v1/roles", {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(res => {
        setRoles(res.data.response);
        setLoading(false);
      })
  }, [])

  useEffect(() => {
    const loadData = (id: string) => {
      axios.get(`/api/v1/users/${id}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
        .then(res => {
          setDataForm({
            ...res.data.response,
            password: ""
          });
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    axios.post("/api/v1/users", dataForm, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Usuario creado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
        await router.push("/admin/usuarios");
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

    let tempDataForm = {
      ...dataForm,
      password: dataForm.password.length === 0 ? undefined : dataForm.password
    };

    axios.put(`/api/v1/users/${id}`, tempDataForm, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Usuario actualizado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
        await router.push("/admin/usuarios");
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

    axios.delete(`/api/v1/users/${id}`, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Usuario eliminado",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
        await router.push("/admin/usuarios");
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
    <Sidebar title={"Usuario"}>
      {
        loading
          ? (<LoadingPage/>)
          : (<form onSubmit={handleSubmit}>
            <SimpleGrid
              columns={{base: 1, md: 2}}
              spacing={{base: 4, md: 8}}
            >
              <FormControl>
                <FormLabel>Usuario</FormLabel>
                <Input name="username" onChange={handleChange} value={dataForm.username} type={"text"} borderColor={"blackAlpha.500"} isRequired/>
                {dataFormError.username && <FormHelperText color={"red"} fontSize={"sm"}>El usuario no puede estar vacío</FormHelperText>}
              </FormControl>
              {
                <FormControl>
                  <FormLabel>
                    {
                      (!(router.query.id && typeof router.query.id === "string")) ? "Contraseña" : "Nueva contraseña"
                    }
                  </FormLabel>
                  <Input name="password" onChange={handleChange} value={dataForm.password} type={"text"} borderColor={"blackAlpha.500"} isRequired/>
                  {dataFormError.password && <FormHelperText color={"red"} fontSize={"sm"}>La contraseña no puede estar vacía</FormHelperText>}
                </FormControl>
              }
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input name="name" onChange={handleChange} value={dataForm.name} type={"text"} borderColor={"blackAlpha.500"} isRequired/>
                {dataFormError.name && <FormHelperText color={"red"} fontSize={"sm"}>Este campo es obligatorio</FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel>Apellidos</FormLabel>
                <Input name="last_name" onChange={handleChange} value={dataForm.last_name} type={"text"} borderColor={"blackAlpha.500"} isRequired/>
                {dataFormError.last_name && <FormHelperText color={"red"} fontSize={"sm"}>Este campo es obligatorio</FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input name="email" onChange={handleChange} value={dataForm.email} type={"email"} borderColor={"blackAlpha.500"} isRequired/>
                {dataFormError.email && <FormHelperText color={"red"} fontSize={"sm"}>Este campo es obligatorio</FormHelperText>}
              </FormControl>
              <FormControl>
                <FormLabel>Rol</FormLabel>
                <Select
                  placeholder='Elige una opción'
                  borderColor={"blackAlpha.500"}
                  value={dataForm.id_rol}
                  name="id_rol"
                  onChange={handleChange}
                  isRequired
                >
                  {
                    roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))
                  }
                </Select>
                {dataFormError.id_rol && <FormHelperText color={"red"} fontSize={"sm"}>Este campo es obligatorio</FormHelperText>}
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
                    titleAlertDialog={"Eliminar Usuario"}
                    messageAlertDialog={"¿Está seguro que desea eliminar este usuario?"}
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