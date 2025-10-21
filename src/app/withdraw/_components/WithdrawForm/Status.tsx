import { TxnLink } from "@/components/TxnLink";
import { RequestWithdrawalStatus } from "./types";

export const Status = ({
  status,
  chainId,
  requestHash,
  error,
}: {
  status: RequestWithdrawalStatus;
  chainId?: number;
  requestHash?: string;
  error?: unknown;
}) => {
  if (status === "idle") return null;

  return (
    <div
      className="bg-white/5 border-2 border-dashed border-[#364DED]/50 text-white/80 px-4 py-3 rounded-lg"
      role="alert"
    >
      {status === "requesting" && (
        <div className="loading-ellipses">
          Waiting for withdraw request confirming
        </div>
      )}

      {status === "requested" && (
        <div>
          Withdraw request initiated!{" "}
          {requestHash && chainId != null && (
            <TxnLink chainId={chainId} hash={requestHash} />
          )}
        </div>
      )}

      {status === "error" && !!error && (
        <div className="text-rose-400">
          Some error occurred. Please try later
        </div>
      )}
    </div>
  );
};
