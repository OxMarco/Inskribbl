import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThirdwebProvider } from "thirdweb/react"
import { createThirdwebClient } from "thirdweb"
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { ChakraProvider } from "@chakra-ui/react"
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from "./wagmi";
import Landing from "./Landing";
import App from "./App";
import "./index.css"

const queryClient = new QueryClient();
const clientId = "f9c4f2c67e5d45f77351b07dff99aabd"
const client = createThirdwebClient({ clientId })
const wallets = [
  inAppWallet(),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
]

function Providers() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={"4gJOQeCbY7WJmPFTvwtBG3hG5oRr76z4"}
          chain={base}
        >
          <ThirdwebProvider>
            <ChakraProvider>

              <Router>
                <Routes>
                  <Route path="/" element={<Landing client={client} wallets={wallets} />} />
                  <Route path="/play" element={<App client={client} wallets={wallets} />} />
                </Routes>
              </Router>

            </ChakraProvider>
          </ThirdwebProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Providers
