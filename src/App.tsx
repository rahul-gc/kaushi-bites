import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAdminStore } from "@/store/adminStore";
import Navbar from "@/components/Navbar";
import CartPanel from "@/components/CartPanel";
import LoginModal from "@/components/LoginModal";
import AdminLoginModal from "@/components/AdminLoginModal";
import Index from "./pages/Index";
import MenuPage from "./pages/Menu";
import CheckoutPage from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAdmin } = useAdminStore();

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <>
      <Navbar />
      <CartPanel />
      <LoginModal />
      <AdminLoginModal />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
