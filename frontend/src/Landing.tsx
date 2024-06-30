import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThirdwebClient } from "thirdweb";
import { useActiveWallet } from "thirdweb/react";
import Wallet from "./components/Wallet";
import Logo from "./components/Logo";

function Landing({ client, wallets }: { client: ThirdwebClient, wallets: any[] }) {
  const wallet = useActiveWallet();
  const navigate = useNavigate();

  useEffect(() => {
    const checkWalletConnection = async () => {
      if(wallet) {
        navigate('/play')
      }
    };

    checkWalletConnection();
  }, [wallet]);

  return (
    <div className="Landing">

      <h1 id="TitleText">
        <Logo />
      </h1>

      <div className="UserInfo">
        <Wallet client={client} wallets={wallets} />
      </div>

    </div>
  );
}

export default Landing

