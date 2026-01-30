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
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/types/hospital';

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
  admin: 'bg-purple-100 text-purple-700',
  doctor: 'bg-blue-100 text-blue-700',
  nurse: 'bg-green-100 text-green-700',
  receptionist: 'bg-orange-100 text-orange-700',
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { currentRole, setCurrentRole, setIsLoggedIn } = useRole();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { path: '/patients', label: 'Patients', icon: Users, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { path: '/appointments', label: 'Appointments', icon: Calendar, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { path: '/staff', label: 'Staff Directory', icon: UserCog, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    { path: '/billing', label: 'Billing', icon: Receipt, roles: ['admin', 'doctor', 'receptionist'] },
    { path: '/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentRole));

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">MedCare HMS</span>
          </div>

          {/* Role Selector */}
          <div className="border-b p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className={cn('rounded px-2 py-0.5 text-xs font-medium', roleColors[currentRole])}>
                    {roleLabels[currentRole]}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-popover" align="start">
                {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => setCurrentRole(role)}
                    className={cn(currentRole === role && 'bg-accent')}
                  >
                    <span className={cn('rounded px-2 py-0.5 text-xs font-medium', roleColors[role])}>
                      {roleLabels[role]}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
