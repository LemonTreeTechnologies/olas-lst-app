import { ReactNode } from "react";
import { MdClose } from "react-icons/md";
import { Button } from "../Button";

type DialogAction = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
};

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  children: ReactNode;
  actions?: DialogAction[];
};

export const Dialog = ({
  isOpen,
  onClose,
  title,
  children,
  actions = [],
}: DialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 transform overflow-hidden rounded-lg bg-zinc-800 text-left shadow-xl outline outline-1 -outline-offset-1 outline-white/10 transition-all w-full max-w-lg">
        <div className="flex justify-between border-b border-white/10 p-6">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <MdClose className="text-2xl cursor-pointer" onClick={onClose} />
        </div>
        <div className="px-6 mt-6 text-base text-white">{children}</div>
        <div className="p-6 flex justify-end gap-3">
          {actions.map(({ label, onClick, variant = "primary" }, idx) => (
            <Button key={idx} onClick={onClick} variant={variant}>
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
