import React, {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Box, Text, Image, Flex} from "@chakra-ui/react";

interface Props {
  images: string[]
}

const MotionBox = motion(Box);

export const SliderImages = ({images}: Props) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const handleNextImage = () => setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    const interval = setInterval(handleNextImage, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [images.length]);

  return (<>
    <Flex
      w="100%"
      h="300px"
      cursor={"pointer"}
      borderRadius={"lg"}
      border={"1px solid #e2e8f0"}
      p={2}
      alignItems={"center"}
      justifyContent={"center"}
      direction={"column"}
    >
      {
        images.length > 1
        && (<Text
          textAlign={"center"}
          mb={2}
        >
          {currentImage + 1} / {images.length}
        </Text>)
      }

      <AnimatePresence>
        <MotionBox
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.5}}
        >
          <Image
            src={images[currentImage] || "/assets/images/placeholderImg.jpg"}
            alt={"image"}
            objectFit={"cover"}
            h={"250px"}
            borderRadius={"lg"}
          />
        </MotionBox>
      </AnimatePresence>
    </Flex>
  </>);
}