import { TxnLink } from "@/components/TxnLink";
import { RequestWithdrawalStatus } from "./types";

export const Status = ({
  status,
  chainId,
  approveHash,
  requestHash,
  error,
}: {
  status: RequestWithdrawalStatus;
  chainId?: number;
  approveHash?: string;
  requestHash?: string;
  error?: unknown;
}) => {
  if (status === "idle") return null;

  return (
    <div
      className="bg-white/5 border-2 border-dashed border-[#364DED]/50 text-white/80 px-4 py-3 rounded-lg"
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
