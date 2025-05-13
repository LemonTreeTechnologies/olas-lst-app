import { MouseEventHandler } from "react";
import { Spinner } from "../loaders/Spinner";

type ButtonProps = {
  children: string | React.ReactElement;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: "primary" | "link";
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
};

const VARIANT_CLASS_NAMES = {
  primary:
    "py-2 px-4 bg-[#364DED] hover:bg-[#364DED]/90 text-white cursor-pointer",
  link: "text-white/50 hover:text-white/70 cursor-pointer",
};

const DISABLED_CLASS_NAMES = {
  primary: "py-2 px-4 bg-[#364DED]/20 cursor-not-allowed text-white/40",
  link: "text-white/30 cursor-not-allowed",
};

export const Button = ({
  onClick,
  children,
  variant = "primary",
  className = "",
  disabled,
  isLoading,
}: ButtonProps) => (
  <button
    className={`font-semibold rounded-lg ${
      (disabled
        ? DISABLED_CLASS_NAMES[variant]
        : VARIANT_CLASS_NAMES[variant]) || ""
    } ${className}`}
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
  >
    {isLoading ? <Spinner /> : children}
  </button>
);
