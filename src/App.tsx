import { Box, Container, Grid, GridItem } from "@chakra-ui/react"
import { ThirdwebClient } from "thirdweb"
import Header from "./components/Header"
import DrawingBoard from "./components/DrawingBoard";
import PlayerList from "./components/PlayerList"
import Chat from "./components/Chat"
import '@coinbase/onchainkit/styles.css';
import { useEffect } from "react";
import { useActiveWallet } from "thirdweb/react";
import { useNavigate } from "react-router-dom";

function App({ client, wallets }: { client: ThirdwebClient, wallets: any[] }) {
  const wallet = useActiveWallet();
  const navigate = useNavigate();

  useEffect(() => {
    const checkWalletConnection = async () => {
      if(!wallet) {
        navigate('/')
      }
    };

    checkWalletConnection();
  }, [wallet]);

  return (
    <Box minHeight="100vh" className="App">
      <Header client={client} wallets={wallets} />
      <Container maxW="container.xl" py={[4, 6, 8]}>
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 2fr", lg: "2fr 3fr" }}
          gap={[2, 4, 6]}
        >
          <GridItem>
            <PlayerList players={[
              { wallet: '0x35d389B751943Cbf3fE3620a668566E97D5f0144', score: 1, isDrawing: true },
              { wallet: '0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9', score: 3, isDrawing: false },
            ]} />
          </GridItem>
          <GridItem>
            <DrawingBoard />
          </GridItem>
          <GridItem>
            <Chat messages={[]} />
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
}

export default App
