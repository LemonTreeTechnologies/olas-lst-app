import { mainnet } from "viem/chains";
import { useAccount } from "wagmi";
import { networks } from "@/config/wagmi";

export const useChainId = () => {
  const { chainId } = useAccount();

  if (!chainId) return mainnet.id;
  if (!networks.map((network) => network.id).includes(chainId)) {
    throw new Error("Network not supported");
  }

  return chainId;
};
