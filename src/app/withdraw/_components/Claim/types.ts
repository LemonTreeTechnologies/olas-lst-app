export type FInalizeWithdrawalStatus =
  | "idle"
  | "approving"
  | "approved"
  | "finalizing"
  | "finalized"
  | "error";

export type WithdrawRequest = {
  id: string;
  txHash: string;
  isComplete: boolean;
  isAvailable: boolean;
  olasAmount: string;
  olasAmountInWei: string;
  timeTillAvailable: string | null;
};
