import type { Metadata } from "next";
import { headers } from "next/headers";
import { Figtree } from "next/font/google";
import "./globals.css";
import ReownAppKitProvider from "@/context/ReownAppKitProvider";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Liquid Staking Olas",
  description:
    "Liquid staking with stOLAS. Scalable rewards and enhanced strategies powered by a modular framework.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookies = headersData.get("cookie");

  return (
    <html lang="en">
      <body className={`${figtree.variable} antialiased`}>
        <ReownAppKitProvider cookies={cookies}>{children}</ReownAppKitProvider>
      </body>
    </html>
  );
}
