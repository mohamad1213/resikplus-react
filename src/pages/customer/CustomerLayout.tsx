import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import CustomerSidebar from "@/components/customer/CustomerSidebar";
import CustomerHeader from "@/components/customer/CustomerHeader";
import LoadingSpinner from "@/components/ui/loading-spinner";

const pageTitles: Record<string, string> = {
  "/customer": "Dashboard",
  "/customer/courses": "Kursus Saya",
  "/customer/progress": "Progress Belajar",
  "/customer/certificates": "Sertifikat",
  "/customer/profile": "Profil Saya",
};

const CustomerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, isAdmin } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (isAdmin) {
        navigate("/admin");
      }
    }
  }, [user, loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const pageTitle = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <CustomerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <CustomerHeader
          onMenuClick={() => setSidebarOpen(true)}
          title={pageTitle}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
