import {Box, useDisclosure, keyframes, Text, Flex, VStack} from '@chakra-ui/react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useState} from "react";
import {faClose, faBell} from "@fortawesome/free-solid-svg-icons";
import {FloatingSocialMedia} from "@/components/FloatingSocialMedia";

const Bubble = () => {
  const startBubble = 100

  const [opened, setOpened] = useState(false)
  const {isOpen, onOpen, onClose} = useDisclosure()

  const animationMove = (move: number, action: string) => {
    return keyframes`
      0% {
        transform: translateY(${action === '-' ? 0 : -startBubble}px);
        opacity: ${action === '-' ? 0 : 1};
      }
      50% {
        opacity: ${action === '-' ? 1 : 0};
      }
      100% {
        transform: translateY(${action}${move}px);
        opacity: ${action === '-' ? 1 : 0};
      }
    `
  }

  const handleSocial = () => {
    if (!isOpen) {
      onOpen()
      setOpened(false)
    } else {
      onClose()
      setOpened(true)
    }
  }

  return (<Box>
    <Box
      position={"fixed"}
      bottom={"20px"}
      right={"20px"}
    >
      <Flex
        position={"fixed"}
        bottom={"20px"}
        right={"90px"}
        bg={"dodgerblue"}
        borderRadius={"50%"}
        w={"40px"}
        h={"40px"}
        alignItems={"center"}
        justifyContent={"center"}
        onClick={handleSocial}
      >
        <Text
          color="white"
          fontSize="16px"
        >
          {
            !isOpen
              ? (<FontAwesomeIcon icon={faBell}/>)
              : (<FontAwesomeIcon icon={faClose}/>)
          }
        </Text>
      </Flex>
      {
        isOpen && !opened
          ? (<VStack
            animation={`${animationMove(startBubble, "-")} 3s forwards`}
          >
            <FloatingSocialMedia/>
          </VStack>)
          : (<VStack
            animation={opened ? `${animationMove(startBubble, "+")} 3s forwards` : ""}
            display={!opened ? "none" : "flex"}
          >
            <FloatingSocialMedia/>
          </VStack>)
      }
    </Box>
  </Box>);
};

export default Bubble
