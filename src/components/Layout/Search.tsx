import {Flex, FormControl, Input, InputGroup, InputRightElement} from "@chakra-ui/react";
import React, {ChangeEvent, FormEvent, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";

export const Search = () => {
  const router = useRouter()

  const [search, setSearch] = useState("")

  const handleChange = ({target: {value}}: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setSearch(value);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault()

    if (search.trim().length > 0) await router.push(`/search/${search}`)
  }

  return (<Flex
    justify="center"
    p={4}
  >
    <form onSubmit={handleSearch}>
      <FormControl>
        <InputGroup>
          <InputRightElement
            cursor={"pointer"}
            onClick={handleSearch}
          >
            <FontAwesomeIcon icon={faSearch}/>
          </InputRightElement>
          <Input type="text" placeholder="Buscar" value={search} onChange={handleChange} name="search" borderColor={"blackAlpha.500"} bg={"white"} w={"800px"}/>
        </InputGroup>
      </FormControl>
    </form>
  </Flex>)
}