import { ThirdwebClient } from "thirdweb"
import { base, anvil, sepolia } from "thirdweb/chains"
import { ConnectButton } from "thirdweb/react"

function Wallet({ client, wallets }: { client: ThirdwebClient, wallets: any[] }) {
  return (
    <ConnectButton client={client} wallets={wallets} chains={[base, anvil, sepolia]} />
  )
}

export default Wallet
