import {faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon,} from "@fortawesome/react-fontawesome";
import {IconButton, Text, Image, Flex, HStack, Stack} from "@chakra-ui/react";
import {useCart} from "@/hooks/useCart";

export const CartList = () => {
  const {cart, removeProduct, addProduct} = useCart()

  return (<>
      {
        cart.map((item, index) => (
          <Flex
            key={index}
            justifyContent={{base: "space-around", md: "space-between"}}
            alignItems="center"
            my={4}
            py={4}
            borderBottom={'1px solid'}
          >
            <Stack
              spacing={5}
              direction={{base: "column", md: "row"}}
              alignItems={"center"}
            >
              <Image
                src={item.images[0] || '/assets/images/placeholderImg.jpg'}
                alt={item.name}
                width={{base: "80px", md: "100"}}
              />

              <Text
                fontSize="lg"
                fontWeight="bold"
              >
                {item.name}
              </Text>

              <HStack
                border={'1px solid'}
                borderColor={'gray.200'}
                borderRadius={'md'}
              >
                <IconButton
                  aria-label={'remove'}
                  icon={<FontAwesomeIcon icon={faMinus}/>}
                  variant="unstyled"
                  onClick={() => removeProduct(item)}
                />

                <Text>
                  {item.count}
                </Text>

                <IconButton
                  aria-label={'add'}
                  icon={<FontAwesomeIcon icon={faPlus}/>}
                  variant="unstyled"
                  onClick={() => addProduct(item)}
                />
              </HStack>

              <Text>
                $ {item.price.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </Text>

            </Stack>

            <Text>
              $ {(item.price * item.count).toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </Text>
          </Flex>
        ))
      }
    </>
  )
}