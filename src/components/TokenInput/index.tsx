import Image from "next/image";
import { FC } from "react";
import { LuWallet } from "react-icons/lu";
import { Button } from "../Button";
import { formatUnits, parseUnits } from "viem";
import { TokenType } from "@/types";
import { TOKEN_LOGOS } from "@/constants";

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  token: TokenType;
  balance: string;
  rawBalance: bigint | undefined;
}

const PERCENTAGES = [25, 50, 75, 100];

export const TokenInput: FC<TokenInputProps> = ({
  value,
  onChange,
  token,
  balance,
  rawBalance,
}) => {
  const rawBalanceInEth = rawBalance ? Number(formatUnits(rawBalance, 18)) : 0;
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
        <Image
          src={TOKEN_LOGOS[token]}
          alt={`${token} logo`}
          width="24"
          height="24"
        />

        <input
          className="bg-transparent outline-none flex-1 text-white placeholder:text-white/50 text-base"
          placeholder={`Enter ${token} amount`}
          value={value}
          onChange={(e) => {
            const inputValue = e.target.value;

            // Allow only numbers and a single decimal point
            if (/^\d*\.?\d*$/.test(inputValue)) {
              if (inputValue === "") {
                onChange("");
                return;
              }

              try {
                // Ensure valid decimal input (up to 18 decimals)
                const parsed = parseUnits(inputValue, 18);

                // Do not allow entering values higher than balance
                if (rawBalance && parsed > rawBalance) {
                  onChange(formatUnits(rawBalance, 18));
                } else {
                  onChange(inputValue);
                }
              } catch {
                // ignore invalid (too many decimals, etc.)
              }
            }
          }}
        />
      </div>
      <div className="flex gap-2 justify-end">
        {PERCENTAGES.map((percentage) => (
          <Button
            variant="link"
            key={percentage}
            disabled={!rawBalanceInEth}
            onClick={
              rawBalance
                ? () => {
                    const amount =
                      (rawBalance * BigInt(percentage)) / BigInt(100);
                    onChange(formatUnits(amount, 18)); // precise decimal string
                  }
                : undefined
            }
          >
            {`${percentage}%`}
          </Button>
        ))}
      </div>
    </div>
  );
};
