import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCog,
  Receipt,
  Settings,
  LogOut,
  ChevronDown,
  Stethoscope,
  Briefcase,
  Menu,
  X,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/types/hospital';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcut';

interface LayoutProps {
  children: ReactNode;
}

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrator',
  doctor: 'Doctor',
  nurse: 'Nurse',
  receptionist: 'Receptionist',
};

const roleColors: Record<UserRole, string> = {
  admin: 'bg-violet-500/20 text-violet-600 border border-violet-500/30',
  doctor: 'bg-blue-500/20 text-blue-600 border border-blue-500/30',
  nurse: 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30',
  receptionist: 'bg-amber-500/20 text-amber-600 border border-amber-500/30',
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { currentRole, setCurrentRole, setIsLoggedIn } = useRole();
  const [mobileOpen, setMobileOpen] = useState(false);
  useKeyboardShortcuts();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { path: '/patients', label: 'Patients', icon: Users, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { path: '/appointments', label: 'Appointments', icon: Calendar, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { path: '/staff', label: 'Staff Directory', icon: UserCog, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { path: '/billing', label: 'Billing', icon: Receipt, roles: ['admin', 'doctor', 'receptionist'] },
    { path: '/hr', label: 'HR Management', icon: Briefcase, roles: ['admin'] },
    { path: '/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentRole));

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const sidebarContent = (
    <div className="relative flex h-full flex-col overflow-hidden">
      <FloatingParticles quantity={15} className="opacity-30" />
      
      {/* Logo */}
      <div className="relative z-10 flex h-16 items-center justify-between border-b border-border/50 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 backdrop-blur-sm">
            <Stethoscope className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-bold">MedCare HMS</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Role Selector */}
      <div className="relative z-10 border-b border-border/50 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent/50"
            >
              <span className={cn('rounded-lg px-2.5 py-1 text-xs font-semibold', roleColors[currentRole])}>
                {roleLabels[currentRole]}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover/95 backdrop-blur-xl border-border/50" align="start">
            {(Object.keys(roleLabels) as UserRole[]).map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => setCurrentRole(role)}
                className={cn(
                  'cursor-pointer transition-colors',
                  currentRole === role && 'bg-accent'
                )}
              >
                <span className={cn('rounded-lg px-2.5 py-1 text-xs font-semibold', roleColors[role])}>
                  {roleLabels[role]}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 space-y-1 p-4 overflow-y-auto">
        {filteredNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Link
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-primary"
                    layoutId="activeNav"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  {item.label}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="relative z-10 border-t border-border/50 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border/50 bg-card/80 backdrop-blur-xl px-4 md:hidden">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            <span className="font-bold">MedCare</span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 z-50 h-screen w-72 bg-card/95 backdrop-blur-xl border-r border-border/50 md:hidden"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside 
        className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/50 bg-card/80 backdrop-blur-xl hidden md:block"
        initial={{ x: -64, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Main Content */}
      <motion.main 
        className="flex-1 md:ml-64 mt-14 md:mt-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="p-4 md:p-8">{children}</div>
      </motion.main>
    </div>
  );
}
