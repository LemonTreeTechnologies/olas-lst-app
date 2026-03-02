"use client";

import { wagmiAdapter, projectId, networks } from "@/config/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import React, { type ReactNode } from "react";
import { WagmiProvider, type Config } from "wagmi";

// Set up queryClient
export const queryClient = new QueryClient();

// Set up metadata
const metadata = {
  name: "stOLAS",
  description: "OLAS LST - liquid staking solution for the OLAS token.",
  url: "https://lstolas.xyz",
  icons: ["https://lstolas.xyz/images/stOLAS-icon.svg"],
};

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  themeMode: "dark",
});

const ReownAppKitProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default ReownAppKitProvider;
