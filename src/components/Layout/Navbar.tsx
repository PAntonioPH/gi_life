import {Box, Flex, HStack, IconButton, SimpleGrid, Image, useBreakpointValue, useDisclosure, Center} from '@chakra-ui/react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faBars} from "@fortawesome/free-solid-svg-icons"
import {useRouter} from "next/router";
import axios from "axios";
import {NavbarMobile} from "@/components/Layout/NavbarMobile";
import React, {useEffect, useState} from "react";
import {Category} from "@/interfaces/Category";
import {NavbarItem} from "@/components/Layout/NavbarItem";
import {DateWeather} from "@/components/DateWeather";
import Bubble from "@/components/Bubble";

export const Navbar = () => {
  const router = useRouter()
  const isDesktop = useBreakpointValue({base: false, lg: true})
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [pages, setPages] = useState<Category[]>([])

  const handleClickNav = async (url: string) => await router.push(url === "/" ? "/" : `/category${url}`)

  useEffect(() => {
    axios.get('/api/v1/categories', {
      params: {navbar: true,},
      headers: {Authorization: `${process.env.NEXT_PUBLIC_TOKEN_WEB}`}
    })
      .then(res => {
        if (res.data.response.length > 0) setPages(res.data.response)
      })
  }, [])

  return (
    <>
      <Box as="section">
        <Box as="nav" bg="bg-surface" boxShadow="sm">
          <Center>
            <Image
              src="/assets/icons/portada.jpg"
              alt="Portada"
              objectFit="cover"
              w={"full"}
              h={"300px"}
              onClick={()=>router.push('/')}
              cursor={"pointer"}
            />
          </Center>
          <HStack
            spacing="10"
            justify="space-between"
            px={{base: "5", lg: "10"}}
            py={{base: "5", lg: "5"}}
          >
            {isDesktop
              ? (<Flex
                justify="space-between"
                flex="1"
                alignItems="center"
              >
                <SimpleGrid
                  columns={pages.length}
                  spacing={10}
                >
                  {pages.map((page, index) => (
                    <NavbarItem
                      key={index}
                      category={page}
                      handleClickNav={handleClickNav}
                    />
                  ))}
                </SimpleGrid>
              </Flex>)
              : (<IconButton
                variant="ghost"
                icon={<FontAwesomeIcon icon={faBars}/>}
                aria-label="Open Menu"
                onClick={onOpen}
              />)
            }
            <Bubble/>
          </HStack>
        </Box>
      </Box>
      <NavbarMobile
        isOpen={isOpen}
        onClose={onClose}
        handleClickNav={handleClickNav}
        pages={pages}
      />
    </>
  )
}
