import { useState, useRef, useEffect } from 'react';
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
  FormLabel,
  useToast
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import { ContractOptions, keccak256, prepareContractCall, sendAndConfirmTransaction, toHex } from 'thirdweb';
import { Account } from 'thirdweb/wallets';

function Chat({ account, contract, callback }: { account: Account, contract: any, callback: () => void }) {
  const [guess, setGuess] = useState<string>("")
  const [txReceipt, setTxReceipt] = useState<any>()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const toast = useToast()

  const submit = async () => {
    if (!guess) {
      toast({
        status: "error",
        title: "Please enter a guess",
        isClosable: true
      })
      return;
    }

    const wordHash = keccak256(toHex(guess));

    const tx = prepareContractCall({
      contract,
      method: "function submitGuess(string calldata _guess)",
      params: [wordHash],
      value: 10000000000000000n,
    });

    const receipt = await sendAndConfirmTransaction({
      transaction: tx,
      account,
    });

    setTxReceipt(receipt)
  }

  useEffect(() => {
    if (txReceipt && txReceipt.status == 'success') {
      toast({
        status: 'success',
        title: `Guess "${guess}" submitted successfully`
      });
      onClose();
      callback();
    }
  }, [txReceipt]);

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
              <Input onChange={(e) => setGuess(e.target.value)} value={guess} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={submit}>
              Send
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Chat;
