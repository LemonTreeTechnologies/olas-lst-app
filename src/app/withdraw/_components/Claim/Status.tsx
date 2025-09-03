import { TxnLink } from "@/components/TxnLink";
import { FInalizeWithdrawalStatus } from "./types";

export const Status = ({
  status,
  chainId,
  approveHash,
  finalizeHash,
  error,
}: {
  status: FInalizeWithdrawalStatus;
  chainId?: number;
  approveHash?: string;
  finalizeHash?: string;
  error?: unknown;
}) => {
  if (status === "idle") return null;

  return (
    <div
      className="bg-white/5 border-2 border-dashed border-[#364DED]/50 text-white/80 px-4 py-3 rounded-lg mb-4"
      role="alert"
    >
      {status === "approving" && (
        <div className="loading-ellipses">
          Checking allowance and approving if needed
        </div>
      )}

      {(status === "approved" || approveHash) && (
        <>
          <div>
            Token transfer approved!{" "}
            {approveHash && chainId != null && (
              <TxnLink chainId={chainId} hash={approveHash} />
            )}
          </div>
          {status === "approved" && (
            <div className="loading-ellipses">Waiting for txn receipt</div>
          )}
        </>
      )}

      {status === "finalizing" && (
        <div className="loading-ellipses">Waiting for claim confirming</div>
      )}

      {status === "finalized" && (
        <div>
          Claim initiated!{" "}
          {finalizeHash && chainId != null && (
            <TxnLink chainId={chainId} hash={finalizeHash} />
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
