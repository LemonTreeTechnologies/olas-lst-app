import Image from "next/image";
import Link from "next/link";

export const Header = () => (
  <header className="sticky top-0 z-50 w-2xl">
    <nav className="flex justify-between items-center mx-auto max-w-screen-lg gap-2 backdrop-blur-sm bg-[#FFFFFF14] bg-opacity-25 px-2 py-1 rounded-2xl border border-[#FFFFFF1F]">
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
        <button className="text-white font-semibold py-2 px-4 bg-[#364DED] rounded-lg cursor-pointer">
          Launch app
        </button>
      </Link>
    </nav>
  </header>
);
