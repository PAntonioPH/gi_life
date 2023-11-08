import {Box, Flex, Image, Modal, ModalBody, ModalContent, ModalOverlay, useBreakpointValue, useDisclosure, VStack} from "@chakra-ui/react";
import {useState} from "react";
import {SliderImages} from "@/components/Product/SliderImages";

interface Props {
  images: string[]
}

const ViewerImages = ({images}: Props) => {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const isDesktop = useBreakpointValue({base: false, lg: true})
  const [currentImage, setCurrentImage] = useState(0)
  const [currentImageModal, setCurrentImageModal] = useState("")

  const handleClickImage = (image: string) => {
    setCurrentImageModal(image)
    onOpen()
  }

  return (<Flex
    w={{base: "100%", lg: "60%"}}
  >
    {
      isDesktop
        ? (<>
          {
            images.length > 1
            && (<VStack
              w={{base: "100%", lg: "20%"}}
              h={"100%"}
              display={"flex"}
              alignItems={"center"}
              mt={{base: 5, lg: 10}}
            >
              {
                images.map((image, index) => (
                  <Image
                    key={`image-${index}`}
                    src={image}
                    alt={"image"}
                    objectFit={"cover"}
                    h={"100px"}
                    w={"100px"}
                    cursor={"pointer"}
                    border={index === currentImage ? "4px solid #00347f" : "4px solid gray"}
                    borderRadius={"lg"}
                    onClick={() => setCurrentImage(index)}
                    onMouseEnter={() => setCurrentImage(index)}
                  />
                ))
              }
            </VStack>)
          }

          <Box
            w={{base: "100%", lg: images.length > 1 ? "80%" : "100%"}}
            h={"100%"}
            p={10}
          >
            <Image
              src={images[currentImage] || "/assets/images/placeholderImg.jpg"}
              alt={"image"}
              objectFit={"cover"}
              borderRadius={"lg"}
              border={"1px solid #e2e8f0"}
              onClick={() => handleClickImage(images[currentImage])}
              cursor={"pointer"}
            />
          </Box>
        </>)
        : (<>
          <SliderImages
            images={images}
            handleClickImage={handleClickImage}
          />
        </>)
    }
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={"3xl"}
      allowPinchZoom
      isCentered
    >
      <ModalOverlay/>
      <ModalContent
        bg={"transparent"}
        boxShadow={"none"}
      >
        <ModalBody>
          <Image
            src={currentImageModal}
            alt={"image"}
            objectFit={"cover"}
            borderRadius={"lg"}
            border={"1px solid #e2e8f0"}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  </Flex>)
}

export default ViewerImages;