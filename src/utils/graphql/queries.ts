import { gql, request } from "graphql-request";

import {
  StakingModel,
  GetStakingModelsQueryParams,
  GetStakerParams,
  Staker,
  Global,
} from "./types";
import { OLAS_LST_SUBGRAPH_URLS } from "@/constants";
import { DEFAULT_CHAIN_ID } from "@/config/wagmi";

const getStakingModelsQuery = (params: GetStakingModelsQueryParams) => gql`
  query GetStakingModels(
    $status: String!
    $orderBy: String
    $orderDirection: String
    $reminderPerSlot_gte: Int
    $usedSlots_gte: Int
  ) {
    stakingModels(
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: {
        status: $status
        ${params.reminderPerSlot_gte ? "reminderPerSlot_gte: $reminderPerSlot_gte" : ""}
        ${params.usedSlots_gte ? "usedSlots_gte: $usedSlots_gte" : ""}
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
        id
        requestId
        olasAmount
        transactionHash
        withdrawTime
        requestExecution {
          amount
          transactionHash
        }
        requestApproval {
          amount
        }
      }
    }
  }
`;

const globalQuery = `
  query GetGlobal {
    global(id:"") {
      totalStakers
      sevenDaysApr
      sevenDaysMovingApr
    }
  }
`;

export const getStakingModels = async (params: GetStakingModelsQueryParams) =>
  request<{ stakingModels: StakingModel[] }>(
    OLAS_LST_SUBGRAPH_URLS[DEFAULT_CHAIN_ID],
    getStakingModelsQuery(params),
    params,
  );

export const getStaker = async (params: GetStakerParams) =>
  request<{ staker: Staker | null }>(
    OLAS_LST_SUBGRAPH_URLS[DEFAULT_CHAIN_ID],
    stakerQuery,
    params,
  );

export const getGlobal = async () =>
  request<{ global: Global | null }>(
    OLAS_LST_SUBGRAPH_URLS[DEFAULT_CHAIN_ID],
    globalQuery,
  );
