import { sepolia } from "viem/chains";
import { useAccount } from "wagmi";
import { networks } from "@/config/wagmi";

export const useChainId = () => {
  const { chainId } = useAccount();

  // TODO: temporarily return sepolia, once live replace with mainnet
  if (!chainId) return sepolia.id;
  if (!networks.map((network) => network.id).includes(chainId)) {
    throw new Error("Network not supported");
  }

  return chainId;
};
