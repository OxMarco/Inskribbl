import { ThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";
import { PayEmbed } from "thirdweb/react";

function Buy({ client }: { client: ThirdwebClient }) {
  return (
    <PayEmbed client={client}
    payOptions={{
      prefillBuy: {
        chain: base,
      },
    }}
    />
  )
}

export default Buy
