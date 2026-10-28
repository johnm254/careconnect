import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { RoleProvider, useRole } from "@/contexts/RoleContext";
import { ThemeProvider } from "@/hooks/use-theme";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/layout/PageTransition";
import { SplashScreen } from "@/components/layout/SplashScreen";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import PatientLogin from "./pages/PatientLogin";
import PatientSignup from "./pages/PatientSignup";
import PatientDashboard from "./pages/PatientDashboard";
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

// Redirect logged-in users away from the landing page to their dashboard
function LandingRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, currentRole } = useRole();
  if (isLoggedIn) {
    return currentRole === 'patient'
      ? <Navigate to="/patient/dashboard" replace />
      : <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

// Staff login page — redirect if already logged in as staff
function StaffPublicRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, currentRole } = useRole();
  if (isLoggedIn && currentRole !== 'patient') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

// Patient auth pages — redirect if already logged in as patient
function PatientPublicRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, currentRole } = useRole();
  if (isLoggedIn && currentRole === 'patient') {
    return <Navigate to="/patient/dashboard" replace />;
  }
  return <>{children}</>;
}

// Staff-only protected pages
function StaffProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, currentRole } = useRole();
  if (!isLoggedIn || currentRole === 'patient') {
    return <Navigate to="/staff/login" replace />;
  }
  return <>{children}</>;
}

// Patient-only protected pages
function PatientProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, currentRole } = useRole();
  if (!isLoggedIn || currentRole !== 'patient') {
    return <Navigate to="/patient/login" replace />;
  }
  return <>{children}</>;
}

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Landing */}
        <Route path="/" element={<LandingRoute><PageTransition><Landing /></PageTransition></LandingRoute>} />

        {/* Staff auth */}
        <Route path="/staff/login" element={<StaffPublicRoute><PageTransition><Login /></PageTransition></StaffPublicRoute>} />

        {/* Patient auth */}
        <Route path="/patient/login" element={<PatientPublicRoute><PageTransition><PatientLogin /></PageTransition></PatientPublicRoute>} />
        <Route path="/patient/signup" element={<PatientPublicRoute><PageTransition><PatientSignup /></PageTransition></PatientPublicRoute>} />

        {/* Patient protected */}
        <Route path="/patient/dashboard" element={<PatientProtectedRoute><PageTransition><PatientDashboard /></PageTransition></PatientProtectedRoute>} />
        <Route path="/book-consultation" element={<PatientProtectedRoute><PageTransition><BookConsultation /></PageTransition></PatientProtectedRoute>} />

        {/* Staff protected */}
        <Route path="/dashboard" element={<StaffProtectedRoute><PageTransition><Dashboard /></PageTransition></StaffProtectedRoute>} />
        <Route path="/patients" element={<StaffProtectedRoute><PageTransition><Patients /></PageTransition></StaffProtectedRoute>} />
        <Route path="/appointments" element={<StaffProtectedRoute><PageTransition><Appointments /></PageTransition></StaffProtectedRoute>} />
        <Route path="/staff" element={<StaffProtectedRoute><PageTransition><Staff /></PageTransition></StaffProtectedRoute>} />
        <Route path="/billing" element={<StaffProtectedRoute><PageTransition><Billing /></PageTransition></StaffProtectedRoute>} />
        <Route path="/hr" element={<StaffProtectedRoute><PageTransition><HR /></PageTransition></StaffProtectedRoute>} />
        <Route path="/settings" element={<StaffProtectedRoute><PageTransition><Settings /></PageTransition></StaffProtectedRoute>} />

        {/* Legacy redirects */}
        <Route path="/signup" element={<Navigate to="/staff/login" replace />} />

        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(() => localStorage.getItem('splashDisabled') !== 'true');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <RoleProvider>
            {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
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
};

export default App;
