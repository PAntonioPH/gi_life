import {AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button,} from '@chakra-ui/react'
import React, {useRef} from "react";
import {FocusableElement} from "@chakra-ui/utils";

interface Props {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: (id: string) => void,
  id: string
  titleAlertDialog: string;
  messageAlertDialog: string;
  buttonAlertDialog: string;
}

export const ConfirmDialog = ({onClose, isOpen, onConfirm, id, messageAlertDialog, titleAlertDialog, buttonAlertDialog}: Props) => {
  const cancelRef = useRef<FocusableElement | null>(null);

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {titleAlertDialog}
            </AlertDialogHeader>

            <AlertDialogBody>
              {messageAlertDialog}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme='red' onClick={() => {
                onConfirm(id)
              }} ml={3}>
                {buttonAlertDialog}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}