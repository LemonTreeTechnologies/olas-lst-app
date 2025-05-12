import { gql, request } from "graphql-request";

import { StakingModel, StakingModelStatus } from "./types";
import { OLAS_LST_SUBGRAPH_URL } from "@/constants";

export type GetStakingModelsQueryParams = {
  status: StakingModelStatus;
  orderBy?: string;
  orderDirection?: string;
  reminderPerSlot_gte?: number;
};

const getStakingModelsQuery = (params: GetStakingModelsQueryParams) => gql`
  query GetStakingModels(
    $status: String!
    $orderBy: String
    $orderDirection: String
    $reminderPerSlot_gte: Int
  ) {
    stakingModels(
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: {
        status: $status
        ${params.reminderPerSlot_gte ? "reminderPerSlot_gte: $reminderPerSlot_gte" : ""}
      }
    ) {
      id
      chainId
      stakingProxy
      numSlots
      usedSlots
      availableSlots
      stakeLimitPerSlot
      stAmount
      supply
      reminder
      reminderPerSlot
      status
    }
  }
`;

export const getStakingModels = async (params: GetStakingModelsQueryParams) =>
  request<{ stakingModels: StakingModel[] }>(
    OLAS_LST_SUBGRAPH_URL,
    getStakingModelsQuery(params),
    params,
  );
