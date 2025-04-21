import Image from "next/image";
import { FC } from "react";
import { LuWallet } from "react-icons/lu";

type TokenType = "OLAS" | "stOLAS";

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  token: TokenType;
  balance: string;
}

export const TokenInput: FC<TokenInputProps> = ({
  value,
  onChange,
  token,
  balance,
}) => {
  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between items-center text-white font-semibold">
        <span>{`${token} amount`}</span>
        <div className="flex items-center gap-1 font-secondary">
          <span>{balance}</span>
          <LuWallet size={16} />
        </div>
      </div>

      <div className="flex items-center bg-[#FFFFFF0D] border border-white/10 rounded-xl p-3 gap-2">
        {/* Todo — replace with dynamic logo */}
        <Image
          src="/images/olas-icon.svg"
          alt={`${token} logo`}
          width="24"
          height="24"
        />

        <input
          className="bg-transparent outline-none flex-1 text-white placeholder:text-white/50 text-base"
          placeholder={`Enter ${token} amount`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};
