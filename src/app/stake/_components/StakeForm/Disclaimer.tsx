import { Dialog } from "@/components/Dialog";
import { formatNumber } from "@/utils/format";
import { MdOutlineWarningAmber } from "react-icons/md";
import { formatUnits } from "viem/utils";

type DisclaimerProps = {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  limit: number | bigint;
  productName: string;
};
export const Disclaimer = ({
  isOpen,
  onClose,
  onProceed,
  limit,
  productName,
}: DisclaimerProps) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-3">
          <MdOutlineWarningAmber /> Disclaimer
        </span>
      }
      actions={[
        {
          label: "Cancel",
          onClick: onClose,
          variant: "secondary",
        },
        {
          label: "I acknowledge",
          onClick: onProceed,
          variant: "primary",
        },
      ]}
    >
      The deposit amount is limited{" "}
      <b>to {formatNumber(Number(formatUnits(BigInt(limit), 18)))} OLAS</b> in{" "}
      {productName}.
      <br />
      <br />
      This product is provided &quot;as is&quot;, without warranty of any kind.
      Use of this product is at your own risk.
    </Dialog>
  );
};
