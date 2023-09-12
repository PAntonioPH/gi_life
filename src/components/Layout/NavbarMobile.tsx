import {Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Heading, SimpleGrid} from "@chakra-ui/react";
import {Category} from "@/interfaces/Category";
import {NavbarItem} from "@/components/Layout/NavbarItem";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pages: Array<Category>;
  handleClickNav: (url: string) => void;
}

export const NavbarMobile = ({isOpen, onClose, pages, handleClickNav}: Props) => {
  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
      onClose={onClose}
    >
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerCloseButton/>
        <DrawerHeader>
          <Center>
            <Heading>
              Menu
            </Heading>
          </Center>
        </DrawerHeader>
        <DrawerBody>
          <SimpleGrid
            columns={1}
            spacing={8}
            py={5}
            alignItems={"left"}
          >
            {pages.map((page, index) => (
              <NavbarItem
                key={index}
                category={page}
                handleClickNav={handleClickNav}
              />
            ))}
          </SimpleGrid>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}