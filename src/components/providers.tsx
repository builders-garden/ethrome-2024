"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
import { WagmiProvider } from "@privy-io/wagmi";
import { wagmiConfig } from "@/lib/wagmi";
import { base, baseSepolia } from "viem/chains";

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
  defaultChain: baseSepolia,
  supportedChains: [base, baseSepolia],
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider appId="cm1ursrn606y7c56nfnh2j8oi" config={privyConfig}>
      <SmartWalletsProvider
        config={{
          paymasterContext: {
            mode: "SPONSORED",
            calculateGasLimits: true,
            expiryDuration: 300,
            sponsorshipInfo: {
              webhookData: {},
              smartAccountInfo: {
                name: "BICONOMY",
                version: "2.0.0",
              },
            },
          },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            <main className="h-full">{children}</main>
          </WagmiProvider>
        </QueryClientProvider>
      </SmartWalletsProvider>
    </PrivyProvider>
  );
};

export default Providers;
