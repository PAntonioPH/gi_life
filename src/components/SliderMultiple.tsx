import {Badge, Box, Heading, HStack, IconButton, Image, Text, useBreakpointValue, VStack} from '@chakra-ui/react';
import {AnimatePresence, motion} from 'framer-motion';
import {useEffect, useState} from 'react';
import {Product} from "@/interfaces/Product";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/router";

interface Props {
  products: Product[];
  url: string;
}

const MotionBox = motion(Box);

const itemSlider = ({images, id, name, discount, price}: Product, url: string, temp: boolean, handleClick: (id: number, category: string) => Promise<boolean>) => (
  <MotionBox
    key={`slider-${id}${temp ? "-temp" : ""}`}
    initial={{opacity: 0, x: 1000}}
    animate={{opacity: 1, x: 0}}
    color={"black"}
    w="100%"
    h={"500px"}
    bgSize="cover"
    bgPosition="center"
    bgRepeat="no-repeat"
    borderRadius={"lg"}
    cursor={"pointer"}
    _hover={{
      bg: "blackAlpha.200",
    }}
    p={5}
    border={"1px solid #e2e8f0"}
    onClick={() => handleClick(id, url)}
  >
    <Image
      src={images[0] && images[0] != "" ? images[0] : "/assets/images/placeholderImg.jpg"}
      alt={"Producto"}
      borderRadius={"lg"}
      h={"300px"}
      w={"450px"}
      objectFit={"cover"}
    />

    <VStack
      spacing={3}
      mt={2}
    >
      <Heading
        size={"md"}
        textAlign={"justify"}
      >
        {
          name.slice(0, 40)
        }
        {
          name.length > 40
          && "..."
        }
      </Heading>

      {
        discount > 0
        && (<Badge
          borderRadius='lg'
          px='2'
          py={2}
          colorScheme='teal'>
          {discount}% OFF
        </Badge>)
      }

      <HStack>
        <Text
          fontSize={"md"}
          as={discount > 0 ? 'del' : "span"}
          color={discount > 0 ? 'red' : "black"}
        >
          $ {price.toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
        </Text>

        {
          discount > 0
          && (<Text
            color={"#00a650"}
            fontSize={"md"}
          >
            $ {(price - (price * discount) / 100).toLocaleString("es-MX", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </Text>)
        }
      </HStack>
    </VStack>
  </MotionBox>
)

export const SliderMultiple = ({products, url}: Props) => {
  const isDesktop = useBreakpointValue({base: false, lg: true})

  const steps = isDesktop ? 3 : 1;
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => {
        return prev >= products.length - (isDesktop ? 3 : 1) ? 0 : prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [products.length, isDesktop]);

  const handlePrevImage = () => (current <= 0) ? setCurrent(products.length - 1) : setCurrent((prev) => prev - 1);

  const handleNextImage = () => (current >= products.length - (isDesktop ? 3 : 1)) ? setCurrent(0) : setCurrent((prev) => prev + 1);

  const handleClick = async (id: number, category: string) => await router.push(`/category/${category}/item/${id}`)


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
        variant="ghost"
      />

      <AnimatePresence>
        {
          products.slice(current, current + steps).map((product) => (itemSlider(product, url, false, handleClick)))
        }

        {
          (3 - products.slice(current, current + steps).length > 0) && products.slice(0, 1 - products.slice(current, current + steps).length).map((product) => (itemSlider(product, url, true, handleClick)))
        }
      </AnimatePresence>

      {/* Right Button */}
      <IconButton
        aria-label="Next Image"
        icon={<FontAwesomeIcon icon={faChevronRight}/>}
        onClick={handleNextImage}
        variant="ghost"
      />
    </HStack>
  );
};

