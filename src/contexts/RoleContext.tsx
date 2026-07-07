import { createContext, useContext, ReactNode } from 'react';
import { UserRole } from '@/types/hospital';
import { useAuth } from '@/contexts/AuthContext';

interface RoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

/**
 * Thin adapter over AuthContext preserving the original RoleContext interface
 * so pages written against it keep working while they're migrated to
 * useAuth() directly module by module. currentRole/isLoggedIn now reflect the
 * real, server-verified session instead of client-only state.
 */
export function RoleProvider({ children }: { children: ReactNode }) {
  const { me, isAuthenticated, logout } = useAuth();

  const currentRole: UserRole = me?.kind === 'staff' ? me.role : 'admin';
  const isLoggedIn = isAuthenticated && me?.kind === 'staff';

  const setCurrentRole = () => {
    // Roles are now determined server-side by the authenticated account and
    // can no longer be switched client-side.
  };

  const setIsLoggedIn = (value: boolean) => {
    if (!value) logout();
  };

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole, isLoggedIn, setIsLoggedIn }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
