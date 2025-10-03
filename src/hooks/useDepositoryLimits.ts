import { useQuery } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import { config, DEFAULT_CHAIN_ID } from "@/config/wagmi";
import {
  DEPOSITORY_ABI,
  DEPOSITORY_ADDRESSES,
} from "@/constants/contracts/depository";

const PRODUCT_TYPE = {
  Alpha: 0,
  Beta: 1,
  Final: 2,
};

export const useDepositoryLimits = () => {
  return useQuery({
    queryKey: ["depositoryLimits"],
    queryFn: async () => {
      const productType = await readContract(config, {
        address: DEPOSITORY_ADDRESSES[DEFAULT_CHAIN_ID],
        abi: DEPOSITORY_ABI,
        functionName: "productType",
        args: [],
      });

      if (productType === PRODUCT_TYPE.Final) {
        return { productName: "Final", limit: null };
      } else {
        if (![PRODUCT_TYPE.Alpha, PRODUCT_TYPE.Beta].includes(productType)) {
          throw new Error(
            `Unsupported product type: ${productType}. Can't define deposit limit`,
          );
        }

        const productName =
          productType === PRODUCT_TYPE.Alpha ? "Alpha" : "Beta";
        const functionName =
          productType === PRODUCT_TYPE.Alpha
            ? "ALPHA_DEPOSIT_LIMIT"
            : "BETA_DEPOSIT_LIMIT";

        const limit = await readContract(config, {
          address: DEPOSITORY_ADDRESSES[DEFAULT_CHAIN_ID],
          abi: DEPOSITORY_ABI,
          functionName,
          args: [],
        });

        return { productName, limit };
      }
    },
  });
};
