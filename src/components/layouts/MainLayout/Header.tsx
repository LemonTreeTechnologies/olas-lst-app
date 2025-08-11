import Image from "next/image";
import Link from "next/link";
import { WalletConnectButton } from "../WalletConnectButton";

const MENU_ITEMS = [
  {
    key: "stake",
    href: "/stake",
    label: "Stake",
  },
  {
    key: "withdraw",
    href: "/withdraw",
    label: "Withdraw",
  },
  {
    key: "rewards",
    href: "/rewards",
    label: "My rewards",
  },
];

export const Header = () => (
  <header className="max-w-screen-lg w-full sticky top-0 z-50 backdrop-blur-sm bg-[#FFFFFF0D] bg-opacity-25 rounded-2xl overflow-hidden border border-[#FFFFFF0D]">
    <nav className="flex justify-between items-center mx-auto gap-2 px-2 py-1">
      <div className="flex items-center gap-8">
        <Link href="/">
          <Image
            src="/images/stOLAS-logo.svg"
            alt="logo"
            width="136"
            height="40"
            className="mx-auto"
          />
        </Link>

        {MENU_ITEMS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="font-semibold text-lg"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <WalletConnectButton />
    </nav>
  </header>
);
