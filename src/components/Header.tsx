import { Box, HStack, Heading } from '@chakra-ui/react';
import { ThirdwebClient } from 'thirdweb';
import Wallet from './Wallet';
import Logo from './Logo';

function Header({ client, wallets }: { client: ThirdwebClient, wallets: any[] }) {
  return (
    <Box color="white" p={2}>
      <HStack alignItems={'center'} justifyContent={'space-between'}>
        <Heading as="h1"><Logo /></Heading>
        <Wallet client={client} wallets={wallets} />
      </HStack>
    </Box>
  );
};

export default Header;
