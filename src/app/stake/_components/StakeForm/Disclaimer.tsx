import { Dialog } from "@/components/Dialog";
import { MdOutlineWarningAmber } from "react-icons/md";

type DisclaimerProps = {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
};
export const Disclaimer = ({ isOpen, onClose, onProceed }: DisclaimerProps) => {
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
          label: "Acknowledge and Continue",
          onClick: onProceed,
          variant: "primary",
        },
      ]}
    >
      This product is provided &quot;as is&quot;, without warranty of any kind.
      Use of this product is at your own risk.
    </Dialog>
  );
};
