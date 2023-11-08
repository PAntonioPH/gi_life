import {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Box, Text, Image, Flex} from "@chakra-ui/react";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface Props {
  images: string[]
  handleClickImage: (image: string) => void
}

const MotionBox = motion(Box);

export const SliderImages = ({images, handleClickImage}: Props) => {
  const [currentImage, setCurrentImage] = useState(0);

  const handleNextImage = () => (currentImage >= images.length - 1) ? setCurrentImage(0) : setCurrentImage((prev) => prev + 1);

  const handlePrevImage = () => (currentImage <= 0) ? setCurrentImage(images.length - 1) : setCurrentImage((prev) => prev - 1);

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

      <Flex
        alignItems={"center"}
        justifyContent={"center"}
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          size="lg"
          color="black"
          onClick={handlePrevImage}
          cursor="pointer"
          style={{marginRight: "10px"}}
        />

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
              onClick={() => handleClickImage(images[currentImage])}
            />
          </MotionBox>
        </AnimatePresence>

        <FontAwesomeIcon
          icon={faChevronRight}
          size="lg"
          color="black"
          onClick={handleNextImage}
          cursor="pointer"
          style={{marginLeft: "10px"}}
        />
      </Flex>
    </Flex>
  </>);
}