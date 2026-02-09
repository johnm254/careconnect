import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { RoleProvider, useRole } from "@/contexts/RoleContext";
import { ThemeProvider } from "@/hooks/use-theme";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/layout/PageTransition";
import Login from "./pages/Login";
import BookConsultation from "./pages/BookConsultation";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Staff from "./pages/Staff";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import HR from "./pages/HR";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useRole();
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useRole();
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PublicRoute><PageTransition><Login /></PageTransition></PublicRoute>} />
        <Route path="/book-consultation" element={<PageTransition><BookConsultation /></PageTransition>} />
        <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute><PageTransition><Patients /></PageTransition></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><PageTransition><Appointments /></PageTransition></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute><PageTransition><Staff /></PageTransition></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute><PageTransition><Billing /></PageTransition></ProtectedRoute>} />
        <Route path="/hr" element={<ProtectedRoute><PageTransition><HR /></PageTransition></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><PageTransition><Settings /></PageTransition></ProtectedRoute>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <RoleProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </RoleProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
