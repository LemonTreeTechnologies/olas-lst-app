import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";

export const Header = () => (
  <header className="max-w-2xl w-full sticky top-0 z-50 backdrop-blur-sm bg-[#FFFFFF14] bg-opacity-25 rounded-2xl overflow-hidden border border-[#FFFFFF0D]">
    <nav className="flex justify-between items-center mx-auto gap-2 px-2 py-1">
      <Link href="/" className="justify-self-start col-span-2">
        <Image
          src="/images/stOLAS-logo.svg"
          alt="logo"
          width="136"
          height="40"
          className="mx-auto"
        />
      </Link>
      <Link href="/stake">
        <Button>Launch app</Button>
      </Link>
    </nav>
  </header>
);
