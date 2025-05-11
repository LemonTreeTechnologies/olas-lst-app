import { gql, request } from "graphql-request";

import { StakingModel, StakingModelStatus } from "./types";
import { OLAS_LST_SUBGRAPH_URL } from "@/constants";

const getStakingModelsQuery = gql`
  query GetStakingModels($status: String!) {
    stakingModels(where: { status: $status }) {
      id
      chainId
      stakingProxy
      stakeLimitPerSlot
      numSlots
      status
      blockNumber
      blockTimestamp
      transactionHash
      stAmount
    }
  }
`;

export const getStakingModels = async (params: {
  status: StakingModelStatus;
}) =>
  request<{ stakingModels: StakingModel[] }>(
    OLAS_LST_SUBGRAPH_URL,
    getStakingModelsQuery,
    params,
  );
