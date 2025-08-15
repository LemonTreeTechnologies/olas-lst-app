import { gql, request } from "graphql-request";

import {
  StakingModel,
  GetStakingModelsQueryParams,
  GetStakerParams,
  Staker,
} from "./types";
import { OLAS_LST_SUBGRAPH_URL } from "@/constants";

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

const stakerQuery = `
  query GetStaker($id: String!) {
    staker(id: $id) {
      id
      pendingWithdrawRequests
      completedWithdrawRequests
      withdrawRequests(orderBy: withdrawTime, orderDirection: asc) {
        requestExecution {
          amount
          transactionHash
        }
        id
        requestId
        olasAmount
        transactionHash
        withdrawTime
      }
    }
  }
`;

export const getStakingModels = async (params: GetStakingModelsQueryParams) =>
  request<{ stakingModels: StakingModel[] }>(
    OLAS_LST_SUBGRAPH_URL,
    getStakingModelsQuery(params),
    params,
  );

export const getStaker = async (params: GetStakerParams) =>
  request<{ staker: Staker | null }>(
    OLAS_LST_SUBGRAPH_URL,
    stakerQuery,
    params,
  );
