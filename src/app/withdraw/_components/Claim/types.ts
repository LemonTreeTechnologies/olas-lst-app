export type FInalizeWithdrawalStatus =
  | "idle"
  | "finalizing"
  | "finalized"
  | "error";

export type WithdrawRequest = {
  id: string;
  txHash: string;
  isComplete: boolean;
  isAvailable: boolean;
  isApproved: boolean;
  olasAmount: string;
  olasAmountInWei: string;
  timeTillAvailable: string | null;
};
