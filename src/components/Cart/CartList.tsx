import {faPlus, faMinus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconButton, Text, Image, Flex, HStack, Stack, Input} from "@chakra-ui/react";
import {useCart} from "@/hooks/useCart";

export const CartList = () => {
  const {cart, removeProduct, addProduct, setCount, deleteProduct} = useCart()

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
                fontWeight="bold"
              >
                {
                  item.name.substring(0, 40)
                }
                {
                  item.name.length > 30
                  && "..."
                }
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

                <Input
                  type={"number"}
                  value={item.count}
                  onChange={(e) => setCount(item, parseInt(e.target.value))}
                  min={1}
                  max={item.stock}
                  w={"100px"}
                  textAlign={"center"}
                />

                <IconButton
                  aria-label={'add'}
                  icon={<FontAwesomeIcon icon={faPlus}/>}
                  variant="unstyled"
                  onClick={() => addProduct(item)}
                />
              </HStack>

              <Text>
                $ {(item.price - (item.price * (item.discount / 100))).toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})} c/u
              </Text>

            </Stack>

            <HStack>
              <Text>
                $ {((item.price * item.count) - ((item.price * item.count) * (item.discount / 100))).toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </Text>

              <IconButton
                aria-label={'delete'}
                icon={<FontAwesomeIcon icon={faTrash}/>}
                variant="unstyled"
                onClick={() => deleteProduct(item)}
              />
            </HStack>
          </Flex>
        ))
      }
    </>
  )
}