import { sepolia } from "viem/chains";
import { useAccount } from "wagmi";

// TODO: remove the hook, use const
export const useChainId = () => {
  const { chainId } = useAccount();

  // TODO: temporarily return sepolia, once live replace with mainnet
  if (!chainId) return sepolia.id;
  return sepolia.id;
};
