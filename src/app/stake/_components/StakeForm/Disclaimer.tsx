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
      <p className="mb-6">
        This product is provided &quot;as is&quot;, without warranty of any
        kind. <br />
        Use of this product is at your own risk.
      </p>
      <p>
        By continuing, you acknowledge that you have read and agree to the{" "}
        <a
          target="_blank"
          href="/disclosures/terms-of-use"
          className="underline"
        >
          Terms of Use
        </a>
        ,{" "}
        <a
          target="_blank"
          href="/disclosures/privacy-policy"
          className="underline"
        >
          Privacy Policy
        </a>
        , and{" "}
        <a
          target="_blank"
          href="/disclosures/risk-disclosure"
          className="underline"
        >
          Risk Disclosure
        </a>
        .
      </p>
    </Dialog>
  );
};
