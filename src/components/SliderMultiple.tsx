import {Box, Text, HStack, IconButton, Image, Flex, Badge, Heading} from '@chakra-ui/react';
import {motion, AnimatePresence} from 'framer-motion';
import {useState, useEffect} from 'react';
import {Product} from "@/interfaces/Product";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/router";

interface Props {
  products: Product[];
  url: string;
}

const MotionBox = motion(Box);

export const SliderMultiple = ({products, url}: Props) => {
  const steps = 4;
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => ((prev + steps) % products.length));
    }, 4000);

    return () => clearInterval(interval);
  }, [products.length]);

  const handlePrevImage = () => (current === 0) ? setCurrent(0) : setCurrent((prev) => prev - steps);

  const handleNextImage = () => (current + steps >= products.length) ? setCurrent(0) : setCurrent((prev) => prev + steps);

  const handleClick = async (id: number) => await router.push(`/category/${products}/item/${id}`)


  return (
    <HStack
      overflow="hidden"
      textAlign="center"
      spacing={2}
      my={5}
    >
      {/* Left Button */}
      <IconButton
        aria-label="Previous Image"
        icon={<FontAwesomeIcon icon={faChevronLeft}/>}
        onClick={handlePrevImage}
        variant="outline"
      />

      <AnimatePresence>
        {products.slice(current, current + steps).map((item) => (
          <MotionBox
            key={item.id}
            initial={{opacity: 0, x: 50}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.5}}
            w="100%"
            h="480px"
            boxShadow={"lg"}
            cursor={"pointer"}
            onClick={() => handleClick(item.id)}
            bg={"white"}
            borderRadius={"lg"}
          >
            <Flex
              direction={"column"}
            >
              <Image
                src={item.images[0] || '/assets/images/placeholderImg.jpg'}
                alt={"products"}
                objectFit={"cover"}
                w={"350px"}
                h={"300px"}
                borderRadius={"lg"}
              />
              <Text
                fontSize={"xl"}
                as={"b"}
                textAlign={"justify"}
                px={5}
                my={2}
              >
                {
                  item.name.slice(0, 38)
                }
                {
                  item.name.length > 38
                  && "..."
                }
              </Text>

              <HStack>
                <Text
                  borderRadius={"lg"}
                  boxShadow={item.discount > 0 ? 'none' : "outline"}
                  mx={5}
                  my={2}
                  fontSize={"lg"}
                  as={item.discount > 0 ? 'del' : "span"}
                  color={item.discount > 0 ? "red" : "#00a650"}
                >
                  ${(item.price).toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </Text>

                {
                  item.discount > 0
                  && (<Text
                    px={5}
                    borderRadius={"lg"}
                    color={"#00a650"}
                    fontSize={"lg"}
                    boxShadow={item.discount > 0 ? 'outline' : "none"}
                  >
                    ${(item.price - (item.price * item.discount) / 100).toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </Text>)
                }
              </HStack>
              {
                item.discount > 0
                && (<Flex
                  direction={"row"}
                  alignItems={"center"}
                  px={5}
                  my={3}
                >
                  <Badge
                    borderRadius='lg'
                    px='2'
                    py={2}
                    colorScheme='teal'
                    color={"blackAlpha.700"}>
                    Descuento:
                  </Badge>
                  <Text
                    as={"b"}
                    mx={2}
                    fontSize={"lg"}
                    color={"darkred"}
                  >
                    {item.discount}%
                  </Text>
                </Flex>)
              }

            </Flex>

          </MotionBox>
        ))}
      </AnimatePresence>

      {/* Right Button */}
      <IconButton
        aria-label="Next Image"
        icon={<FontAwesomeIcon icon={faChevronRight}/>}
        onClick={handleNextImage}
        variant="outline"
      />
    </HStack>
  );
};

