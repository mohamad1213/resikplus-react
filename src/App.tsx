import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CustomerAuthProvider } from "@/contexts/CustomerAuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Education from "./pages/Education";
import Courses from "./pages/Courses";
import Partners from "./pages/Partners";
import News from "./pages/News";
import Products from "./pages/Products";
import OrderConfirmation from "./pages/OrderConfirmation";
import CourseDetail from "./pages/CourseDetail";
import CourseModules from "./pages/course/CourseModules";
import ModuleDetail from "./pages/course/ModuleDetail";
import Login from "./pages/Login";
import PaymentSimulation from "./pages/PaymentSimulation";
// Admin Waste Pickup Pages
import WastePickupList from "./pages/admin/waste-pickups/WastePickupList";
import WastePickupCreate from "./pages/admin/waste-pickups/WastePickupCreate";
import WastePickupEdit from "./pages/admin/waste-pickups/WastePickupEdit";
import WastePickupDetail from "./pages/admin/waste-pickups/WastePickupDetail";
// Public Pages
import WastePickup from "./pages/WastePickup";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import ProductCreate from "./pages/admin/products/ProductCreate";
import ProductEdit from "./pages/admin/products/ProductEdit";
import ProductDetail from "./pages/admin/products/ProductDetail";
import AdminPartners from "./pages/admin/AdminPartners";
import PartnerCreate from "./pages/admin/partners/PartnerCreate";
import PartnerEdit from "./pages/admin/partners/PartnerEdit";
import PartnerDetail from "./pages/admin/partners/PartnerDetail";
import AdminNews from "./pages/admin/AdminNews";
import NewsCreate from "./pages/admin/news/NewsCreate";
import NewsEdit from "./pages/admin/news/NewsEdit";
import NewsDetail from "./pages/NewsDetail";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
// Admin Course Pages
import CourseList from "./pages/admin/courses/CourseList";
import CourseCreate from "./pages/admin/courses/CourseCreate";
import CourseEdit from "./pages/admin/courses/CourseEdit";
import CourseDetailAdmin from "./pages/admin/courses/CourseDetail";
import CourseModulesAdmin from "./pages/admin/courses/CourseModules";
// Customer Pages
import NewCustomerLayout from "./pages/customer/NewCustomerLayout";
import MyLearning from "./pages/customer/MyLearning";
import NewCustomerCertificates from "./pages/customer/NewCustomerCertificates";
import NewCustomerProfile from "./pages/customer/NewCustomerProfile";
import CustomerLogin from "./pages/customer/CustomerLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CustomerAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/education" element={<Education />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/course/:id/modules" element={<CourseModules />} />
              <Route path="/course/:id/module/:moduleId" element={<ModuleDetail />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/products" element={<Products />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/payment" element={<PaymentSimulation />} />
              <Route path="/waste-pickup" element={<WastePickup />} />


              {/* Customer Routes - Clean Design */}
              <Route path="/customer/login" element={<CustomerLogin />} />
              <Route path="/customer" element={<NewCustomerLayout />}>
                <Route index element={<MyLearning />} />
                <Route path="certificates" element={<NewCustomerCertificates />} />
                <Route path="profile" element={<NewCustomerProfile />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/create" element={<ProductCreate />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="products/:id/edit" element={<ProductEdit />} />
                <Route path="partners" element={<AdminPartners />} />
                <Route path="partners/create" element={<PartnerCreate />} />
                <Route path="partners/:id" element={<PartnerDetail />} />
                <Route path="partners/:id/edit" element={<PartnerEdit />} />
                {/* Course CRUD Pages */}
                <Route path="courses" element={<CourseList />} />
                <Route path="courses/create" element={<CourseCreate />} />
                <Route path="courses/:id" element={<CourseDetailAdmin />} />
                <Route path="courses/:id/edit" element={<CourseEdit />} />
                <Route path="courses/:id/modules" element={<CourseModulesAdmin />} />
                <Route path="news" element={<AdminNews />} />
                <Route path="news/create" element={<NewsCreate />} />
                <Route path="news/:id/edit" element={<NewsEdit />} />
                <Route path="news/:id" element={<NewsDetail />} />
                <Route path="waste-pickups" element={<WastePickupList />} />
                <Route path="waste-pickups/create" element={<WastePickupCreate />} />
                <Route path="waste-pickups/:id" element={<WastePickupDetail />} />
                <Route path="waste-pickups/:id/edit" element={<WastePickupEdit />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CustomerAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
