import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import LoadingSpinner from "../ui/loading-spinner";
import { usePageLoading } from "@/hooks/usePageLoading";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const loading = usePageLoading(400);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-[72px]">
        {loading ? (
          <LoadingSpinner fullScreen text="Memuat Halaman" />
        ) : (
          children
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;
