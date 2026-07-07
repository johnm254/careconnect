import { useState, useEffect } from "react";
import { applyStoredPreferences } from "@/lib/preferences";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import { AuthProvider, useAuth, StaffRole } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/hooks/use-theme";
import { PageTransition } from "@/components/layout/PageTransition";
import { SplashScreen } from "@/components/layout/SplashScreen";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Doctors from "./pages/Doctors";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import HealthEducation from "./pages/HealthEducation";
import Login from "./pages/Login";
import BookConsultation from "./pages/BookConsultation";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Staff from "./pages/Staff";
import Payments from "./pages/Payments";
import Expenditure from "./pages/Expenditure";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import HR from "./pages/HR";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: StaffRole[] }) {
  const { me, isLoading } = useAuth();
  if (isLoading) return null;
  if (!me || me.kind !== 'staff') {
    return <Navigate to="/admin" replace />;
  }
  if (roles && !roles.includes(me.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { me, isLoading } = useAuth();
  if (isLoading) return null;
  if (me?.kind === 'staff') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

const AnimatedRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
      <Route path="/about" element={<PageTransition><About /></PageTransition>} />
      <Route path="/doctors" element={<PageTransition><Doctors /></PageTransition>} />
      <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
      <Route path="/services/:slug" element={<PageTransition><ServiceDetail /></PageTransition>} />
      <Route path="/health-education" element={<PageTransition><HealthEducation /></PageTransition>} />
      <Route path="/admin" element={<PublicRoute><PageTransition><Login /></PageTransition></PublicRoute>} />
      <Route path="/book-consultation" element={<PageTransition><BookConsultation /></PageTransition>} />
      <Route path="/dashboard" element={<ProtectedRoute roles={['admin', 'doctor', 'nurse', 'receptionist']}><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
      <Route path="/patients" element={<ProtectedRoute roles={['admin', 'doctor', 'nurse', 'receptionist']}><PageTransition><Patients /></PageTransition></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute roles={['admin', 'doctor', 'nurse', 'receptionist']}><PageTransition><Appointments /></PageTransition></ProtectedRoute>} />
      <Route path="/staff" element={<ProtectedRoute roles={['admin', 'doctor', 'nurse', 'receptionist']}><PageTransition><Staff /></PageTransition></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute roles={['admin', 'doctor', 'receptionist', 'accountant']}><PageTransition><Payments /></PageTransition></ProtectedRoute>} />
      <Route path="/expenditure" element={<ProtectedRoute roles={['admin', 'accountant']}><PageTransition><Expenditure /></PageTransition></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute roles={['admin', 'pharmacist', 'nurse']}><PageTransition><Inventory /></PageTransition></ProtectedRoute>} />
      <Route path="/hr" element={<ProtectedRoute roles={['admin']}><PageTransition><HR /></PageTransition></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute roles={['admin']}><PageTransition><Settings /></PageTransition></ProtectedRoute>} />
      <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
    </Routes>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(() => localStorage.getItem('splashDisabled') !== 'true');

  useEffect(() => {
    applyStoredPreferences();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <RoleProvider>
              {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
              <Toaster />
              <Sonner />
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AnimatedRoutes />
              </BrowserRouter>
            </RoleProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
