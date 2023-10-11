import {faCartShopping} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon,} from "@fortawesome/react-fontawesome";
import {Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, IconButton, useDisclosure, Text,} from "@chakra-ui/react";
import {useCart} from "@/hooks/useCart";
import {useRouter} from "next/router";
import {CartList} from "@/components/Cart/CartList";

export const CartDrawer = () => {
  const router = useRouter()
  const {cart, total} = useCart()
  const {isOpen, onOpen, onClose} = useDisclosure()

  return (<Box>
      <Button
        onClick={onOpen}
        as={IconButton}
        icon={
          <Box position="relative">
            <FontAwesomeIcon icon={faCartShopping}/>
            {
              cart.length > 0
              && (<Box
                position="absolute"
                top="-1"
                right="-1"
                bg="red.500"
                borderRadius="50%"
                width="4"
                height="4"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="xs" color="white" fontWeight="bold">
                  {
                    cart.length
                  }
                </Text>
              </Box>)
            }
          </Box>
        }
        variant="unstyled"
        _hover={{bg: 'none'}}
      >
        Open
      </Button>

      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        size="xl"
      >
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerCloseButton/>
          <DrawerHeader>
            Carrito de compras
          </DrawerHeader>

          <DrawerBody>
            <CartList/>
          </DrawerBody>

          <DrawerFooter>
            <Text
              mr={5}
            >
              Total: $ {total}
            </Text>

            {
              cart.length > 0
              && (<Button
                colorScheme="blue"
                variant="solid"
                onClick={() => router.push('/cart')}
              >
                Ir a pagar
              </Button>)
            }
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}