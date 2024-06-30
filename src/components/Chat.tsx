import { useState, useRef } from 'react';
import {
  Input,
  Button,
  useDisclosure,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';

function Chat({ messages }: { messages: [] }) {
  const [inputMessage, setInputMessage] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialRef = useRef(null)
  const finalRef = useRef(null)

  return (
    <>
      <IconButton
        aria-label="Open chat"
        icon={<ChatIcon />}
        position="fixed"
        bottom="20px"
        left="20px"
        size="lg"
        isRound
        onClick={onOpen}
        colorScheme="blue"
        ref={btnRef}
      />
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Guess The Word</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Your Guess</FormLabel>
              <Input ref={initialRef} placeholder='Guess' />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3}>
              G
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Chat;
