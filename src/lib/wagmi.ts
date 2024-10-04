import { createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
});
