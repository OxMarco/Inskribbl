import { useState } from 'react';
import { Box, Button, FormControl, FormHelperText, FormLabel, Input, useToast } from "@chakra-ui/react";
import { ContractOptions, prepareContractCall, sendAndConfirmTransaction, toHex } from "thirdweb";
import { keccak256 } from 'viem'
import { Account } from 'thirdweb/wallets';

function StartGame({ account, contract, wordCallback }: { account: Account, contract: any, wordCallback: (w: string) => void }) {
  const [word, setWord] = useState('');
  const toast = useToast();

  const start = async () => {
    if (!word) {
      toast({
        status: "error",
        title: "Please enter a word",
        isClosable: true
      })
      return;
    }

    const wordHash = keccak256(toHex(word));

    const tx = prepareContractCall({
      contract,
      method: "function createGame(bytes32 _wordHash, uint256 _duration)",
      params: [wordHash, 10000n], // 10000 is an example duration
    });

    const receipt = await sendAndConfirmTransaction({
      transaction: tx,
      account,
    });

    wordCallback(word)
  }

  return (
    <Box bg='white' borderRadius='md' boxShadow='md' p={4}>
      <FormControl>
        <FormLabel>Choose word</FormLabel>
        <Input 
          type='text' 
          value={word} 
          onChange={(e) => setWord(e.target.value)} 
        />
        <FormHelperText>Not too simple not too complex</FormHelperText>
      </FormControl>
      <Button mt={4} color={'blue.500'} onClick={start}>Start New Game</Button>
    </Box>
  );
}

export default StartGame;
