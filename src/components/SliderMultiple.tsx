import {Box, Text, HStack, IconButton, Image} from '@chakra-ui/react';
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
    }, 2000);

    return () => clearInterval(interval);
  }, [products.length]);

  const handlePrevImage = () => (current === 0) ? setCurrent(products.length - steps) : setCurrent((prev) => prev - steps);

  const handleNextImage = () => (current + steps >= products.length) ? setCurrent(0) : setCurrent((prev) => prev + steps);


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
            h="300px"
          >

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

