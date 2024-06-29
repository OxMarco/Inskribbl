import { useState, useRef } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';

interface Message {
  text: string;
  isSent: boolean;
  userName: string;
}

function Chat({ messages }: { messages: [] }) {
  const [inputMessage, setInputMessage] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {

  };

  // Scroll to bottom when messages change
  useState(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Chat</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" height="100%">
              <Box flex={1} overflowY="auto" pb={4}>
                {messages.map((msg, index) => (
                  <Flex key={index} direction="column" align={msg.isSent ? "flex-end" : "flex-start"} mb={4}>
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      mb={1}
                      mr={msg.isSent ? 2 : 0}
                      ml={msg.isSent ? 0 : 2}
                    >
                      {msg.userName}
                    </Text>
                    <Box
                      maxWidth="70%"
                      bg={msg.isSent ? "blue.500" : "gray.100"}
                      color={msg.isSent ? "white" : "black"}
                      borderRadius="lg"
                      px={3}
                      py={2}
                    >
                      <Text>{msg.text}</Text>
                    </Box>
                  </Flex>
                ))}
                <div ref={messagesEndRef} />
              </Box>
              <Box>
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                />
                <Button onClick={handleSendMessage} mt={2} colorScheme="blue" width="100%">
                  Send
                </Button>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Chat;
