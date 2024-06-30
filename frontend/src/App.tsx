import { useEffect, useState } from "react";
import { Box, Container, Grid, GridItem, Skeleton, useDisclosure } from "@chakra-ui/react"
import { ThirdwebClient, getContract, readContract } from "thirdweb"
import { useActiveWallet } from "thirdweb/react";
import { anvil } from "thirdweb/chains";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header"
import DrawingBoard from "./components/DrawingBoard";
import PlayerList from "./components/PlayerList"
import Chat from "./components/Chat"
import StartGame from "./components/StartGame";
import CongratulatoryModal from "./components/CongratulatoryModal";
import { Game } from "./types";
import { CONTRACT_ABI } from "./abi";
import '@coinbase/onchainkit/styles.css';

function App({ client, wallets }: { client: ThirdwebClient, wallets: any[] }) {
  const wallet = useActiveWallet();
  const account = wallet?.getAccount();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([])
  const [index, setIndex] = useState<number>(2);
  const [currentGame, setCurrentGame] = useState<Game>()
  const [word, setWord] = useState<string>()
  const [guesses, setGuesses] = useState<number>(0)
  const { isOpen, onOpen, onClose } = useDisclosure();

  const makeGuess = () => {
    setGuesses(guesses + 1)
  }

  const setPlayers = (player: string) => {
    setUsers([...users, { wallet: player, index, isDrawing: false }])
    setIndex(index + 1)
  }

  useEffect(() => {
    if (!wallet) {
      navigate('/')
    }
  }, [wallet]);

  useEffect(() => {
    if (currentGame && currentGame.creator != "0x0000000000000000000000000000000000000000")
      setUsers([{ wallet: currentGame.creator, index: 1, isDrawing: true }])
  }, [wallet, currentGame]);

  const contract = getContract({
    client,
    chain: anvil,
    address: "0x700b6A60ce7EaaEA56F065753d8dcB9653dbAD35",
    abi: CONTRACT_ABI as any,
  });

  useEffect(() => {
    const getCurrentGame = async () => {
      const game: any = await readContract({
        contract: contract,
        method: "function currentGame() view returns (bytes32,address,uint256,uint256,address)",
        params: [],
      });

      if (game[1] != "0x0000000000000000000000000000000000000000") {
        const g: Game = {
          wordHash: game[0],
          creator: game[1],
          pot: 0n,
          deadline: game[3],
          winner: game[4],
        }

        if (g.winner === account?.address && account?.address != "0x0000000000000000000000000000000000000000") {
          onOpen();
        } else {
          setCurrentGame(g)
        }
      }
    }

    getCurrentGame();
  }, [word])

  return (
    <Box minHeight="100vh" className="App">
      <Header client={client} wallets={wallets} />
      <Container maxW="container.xl" py={[4, 6, 8]}>
        <CongratulatoryModal isOpen={isOpen} onClose={onClose} />
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 2fr", lg: "2fr 3fr" }}
          gap={[2, 4, 6]}
        >
          <GridItem>
            <PlayerList players={users} />
          </GridItem>
          <GridItem>
            {account?.address && currentGame ?
              <>
                <DrawingBoard address={account.address} host={currentGame.creator} setPlayers={setPlayers} word={word} />
              </>
              :
              <>
                {account ? <StartGame account={account} contract={contract} wordCallback={setWord} /> : <Skeleton />}
              </>
            }
          </GridItem>
          <GridItem>
            {!word && account && <Chat account={account} contract={contract} callback={makeGuess} />}
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
}

export default App
