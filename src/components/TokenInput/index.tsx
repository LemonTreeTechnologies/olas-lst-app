import Image from "next/image";
import { FC } from "react";
import { LuWallet } from "react-icons/lu";
import { Button } from "../Button";
import { formatUnits } from "viem";

type TokenType = "OLAS" | "stOLAS";

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
          onChange={(e) => {
            const inputValue = e.target.value;

            // Allow only numbers and a single decimal point
            if (/^\d*\.?\d*$/.test(inputValue)) {
              const parsedValue = parseFloat(inputValue);

              // Check if the value is within the valid range
              if (!isNaN(parsedValue)) {
                let newValue = parsedValue.toString();

                // Enforce limits only if rawBalance is defined and not NaN
                if (rawBalanceInEth) {
                  newValue =
                    rawBalanceInEth < BigInt(parsedValue)
                      ? rawBalanceInEth.toString()
                      : Math.max(0, parsedValue).toString();

                  console.log("???", newValue);
                }

                onChange(newValue); // Update with the clamped value as a string
              } else if (inputValue === "") {
                onChange(""); // Allow clearing the input
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
              rawBalanceInEth
                ? () => onChange(`${rawBalanceInEth * (percentage / 100)}`)
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
