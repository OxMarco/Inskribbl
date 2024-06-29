import { Box, VStack, Text, Heading, HStack, Badge, Flex } from '@chakra-ui/react';
import { truncateWallet } from '../helpers';
import { Address, Avatar, Identity, Name } from "@coinbase/onchainkit/identity";

interface Player {
  wallet: string;
  score: number;
  isDrawing: boolean;
}

function PlayerList({ players }: { players: Player[] }) {
  return (
    <Box bg="white" borderRadius="md" boxShadow="md" p={4}>
      <VStack spacing={4} align="stretch">
        <Heading size={["sm", "md"]} color={"blue.500"} textAlign="center">PLAYERS</Heading>
        {players.map((player, index) => (
          <Flex
            key={index}
            align="center"
            justify="space-between"
            bg={player.isDrawing ? "yellow.100" : "transparent"}
            p={2}
            borderRadius="md"
          >
            <Identity
  address={player.wallet}
  schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
>
  <Avatar>
    <Badge />
  </Avatar>
  <Name />
  <Address />
</Identity>

<Heading size="md" >#{player.score}</Heading>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
}

export default PlayerList;
