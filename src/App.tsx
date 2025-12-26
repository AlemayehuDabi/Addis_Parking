import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import MapPage from "./pages/MapPage";
import LotsPage from "./pages/LotsPage";
import WalletPage from "./pages/WalletPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* App Routes with Layout */}
          <Route path="/app" element={<AppLayout><MapPage /></AppLayout>} />
          <Route path="/app/lots" element={<AppLayout><LotsPage /></AppLayout>} />
          <Route path="/app/wallet" element={<AppLayout><WalletPage /></AppLayout>} />
          <Route path="/app/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
          
          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
