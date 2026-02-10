import { ReactNode } from 'react';
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
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/types/hospital';
import { motion } from 'framer-motion';
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

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <motion.aside 
        className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/50 bg-card/80 backdrop-blur-xl"
        initial={{ x: -64, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="relative flex h-full flex-col overflow-hidden">
          <FloatingParticles quantity={15} className="opacity-30" />
          
          {/* Logo */}
          <motion.div 
            className="relative z-10 flex h-16 items-center justify-between border-b border-border/50 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 backdrop-blur-sm"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Stethoscope className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="text-lg font-bold">MedCare HMS</span>
            </div>
            <ThemeToggle />
          </motion.div>

          {/* Role Selector */}
          <motion.div 
            className="relative z-10 border-b border-border/50 p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
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
          </motion.div>

          {/* Navigation */}
          <nav className="relative z-10 flex-1 space-y-1 p-4">
            {filteredNavItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <Link
                    to={item.path}
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
                      <motion.span
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="h-5 w-5" />
                      </motion.span>
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Logout */}
          <motion.div 
            className="relative z-10 border-t border-border/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main 
        className="ml-64 flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="p-8">{children}</div>
      </motion.main>
    </div>
  );
}
