import { Footer } from "../Footer";
import { Header } from "./Header";

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => (
  <div className="main-layout flex flex-col items-center justify-items-center min-h-screen p-8">
    <Header />
    <main className="flex flex-col flex-auto w-full items-center p-8">
      {children}
    </main>
    <Footer />
  </div>
);
