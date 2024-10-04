"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { wagmiConfig } from "@/lib/wagmi";
import { sepolia } from "viem/chains";

const queryClient = new QueryClient();

const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "all-users",
  },
  loginMethods: ["email", "google", "farcaster"],
  appearance: {
    theme: "light",
    accentColor: "#676FFF",
    showWalletLoginFirst: true,
  },
  defaultChain: sepolia,
  supportedChains: [sepolia],
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider appId="cm1ursrn606y7c56nfnh2j8oi" config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <main className="h-full">{children}</main>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};

export default Providers;
