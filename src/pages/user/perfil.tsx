import {Layout} from "@/components/Layout/Layout";
import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import axios from "axios";
import {Button, FormControl, FormLabel, Input, SimpleGrid, useToast} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUpFromBracket} from "@fortawesome/free-solid-svg-icons";
import {LoadingPage} from "@/components/LoadingPage";

const Perfil = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [dataForm, setDataForm] = useState({
    country: "",
    state: "",
    municipality: "",
    neighborhood: "",
    postal_code: "",
    street: "",
  });

  useEffect(() => {
    axios.get('/api/v1/user_address',
      {
        params: {
          time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          shopping: true
        },
        headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}
      })
      .then(res => {
        setDataForm(res.data.response)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleChange = ({target: {value, name}}: ChangeEvent<HTMLInputElement>) => {
    let tempValue = value;

    switch (name) {
      case "postal_code":
        if (value.length > 5) tempValue = value.slice(0, 5);
        break;
      default:
        tempValue = value;
    }

    setDataForm({...dataForm, [name]: tempValue});
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    axios.put("/api/v1/user_address", dataForm, {headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}})
      .then(async res => {
        toast({
          title: "Datos actualizados",
          description: res.data.message,
          status: "success",
          isClosable: true,
          position: "top-right"
        });
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

  return (<Layout title={"Perfil"}>
    {
      loading
        ? (<LoadingPage/>)
        : (<form onSubmit={handleSubmit}>
          <SimpleGrid columns={{base: 1, md: 2}} spacing={10}>
            <FormControl>
              <FormLabel>País</FormLabel>
              <Input type="text" name="country" value={dataForm.country} onChange={handleChange} borderColor={"blackAlpha.500"} isRequired/>
            </FormControl>
            <FormControl>
              <FormLabel>Estado</FormLabel>
              <Input type="text" name="state" value={dataForm.state} onChange={handleChange} borderColor={"blackAlpha.500"} isRequired/>
            </FormControl>
            <FormControl>
              <FormLabel>Municipio</FormLabel>
              <Input type="text" name="municipality" value={dataForm.municipality} onChange={handleChange} borderColor={"blackAlpha.500"} isRequired/>
            </FormControl>
            <FormControl>
              <FormLabel>Colonia</FormLabel>
              <Input type="text" name="neighborhood" value={dataForm.neighborhood} onChange={handleChange} borderColor={"blackAlpha.500"} isRequired/>
            </FormControl>
            <FormControl>
              <FormLabel>Código Postal</FormLabel>
              <Input type="number" name="postal_code" value={dataForm.postal_code} onChange={handleChange} borderColor={"blackAlpha.500"} isRequired/>
            </FormControl>
            <FormControl>
              <FormLabel>Calle</FormLabel>
              <Input type="text" name="street" value={dataForm.street} onChange={handleChange} borderColor={"blackAlpha.500"} isRequired/>
            </FormControl>
          </SimpleGrid>

          <Button
            colorScheme={"green"}
            my={5}
            type={"submit"}
            isLoading={isLoading}
            rightIcon={<FontAwesomeIcon icon={faArrowUpFromBracket}/>}
          >
            Actualizar
          </Button>
        </form>)
    }
  </Layout>)
}

export default Perfil