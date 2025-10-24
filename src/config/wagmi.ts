import { cookieStorage, createStorage } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, sepolia, base, gnosis } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = `${process.env.NEXT_PUBLIC_PROJECT_ID}`;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [mainnet, sepolia, gnosis, base] as [
  AppKitNetwork,
  ...AppKitNetwork[],
];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;

export const DEFAULT_CHAIN_ID = mainnet.id;
