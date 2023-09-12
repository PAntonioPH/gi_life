import {Box, Button, ButtonGroup, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay} from "@chakra-ui/react";
import React from "react";
import {useRouter} from "next/router";
import {Logo} from "@/components/Logo";

interface Page {
  name: string;
  dir: string;
  icon: JSX.Element;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pages: Array<Page>;
  handleClickNav: (dir: string) => void;
}

export const SidebarMobile = ({isOpen, onClose, pages, handleClickNav}: Props) => {
  const router = useRouter();

  return (
    <Drawer
      isOpen={isOpen}
      placement='left'
      onClose={onClose}
    >
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerCloseButton/>
        <DrawerHeader>
          <Logo/>
        </DrawerHeader>
        <DrawerBody>
          <ButtonGroup variant="link" spacing={0} flexDirection={"column"}>
            {
              pages.map(({icon, dir, name}) => (
                <Button
                  justifyContent={"flex-start"}
                  textAlign={"left"}
                  mt={7}
                  isActive={router.pathname.search(dir) >= 0}
                  onClick={() => handleClickNav(dir)}
                  key={name}
                  colorScheme={"black"}
                  _active={{textDecoration: "underline"}}
                >
                  <Box mr={4}>{icon}</Box>{name}
                </Button>
              ))
            }
          </ButtonGroup>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
};