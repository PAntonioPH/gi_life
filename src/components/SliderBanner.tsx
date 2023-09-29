import React, {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {Box, Flex} from "@chakra-ui/react";
import {Banner} from "@/interfaces/Banner";

interface Props {
  banner: Banner[]
}

export const SliderBanner = ({banner}: Props) => {
  const images = banner.map(post => post.img)
  const [currentImage, setCurrentImage] = useState(0);
  const dots = Array.from(Array(images.length).keys())

  useEffect(() => {
    const handleNextImage = () => setCurrentImage((prevImage) => (prevImage + 1) % images.length);

    const interval = setInterval(handleNextImage, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [images.length]);

  return (<>
    {
      banner.length > 0 && (<Box
        w="100%"
        h="500px"
        position="relative"
        cursor={"pointer"}
      >
        <motion.div
          key={currentImage}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.5}}
          style={{
            backgroundImage: `url(${images[currentImage] || "/assets/images/placeholderImg.jpg"})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'end',
            borderRadius: '25px'
          }}
        >
          <Flex
            justify="end"
            mb={5}
            mr={5}
          >
            {
              dots.map(dot => (
                <Box
                  key={dot}
                  bg={dot === currentImage ? "#29234b" : "white"}
                  rounded={"full"}
                  mx={1}
                  onClick={() => setCurrentImage(dot)}
                  _hover={{bg: "#8f2929"}}
                  border={"1px solid white"}
                  w={{base: "10px", lg: "15px"}}
                  h={{base: "10px", lg: "15px"}}
                >
                </Box>))
            }
          </Flex>
        </motion.div>
      </Box>)
    }
  </>);
}