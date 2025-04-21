import { Footer } from "../Footer";
import { Header } from "./Header";

type LaunchLayoutProps = {
  children: React.ReactNode;
};

export const LaunchLayout = ({ children }: LaunchLayoutProps) => (
  <div className="flex flex-col items-center justify-items-center min-h-screen p-8 bg-[url('/images/noise.png')] bg-no-repeat bg-cover">
    <Header />
    <main className="flex flex-col flex-auto">{children}</main>
    <Footer />
  </div>
);
