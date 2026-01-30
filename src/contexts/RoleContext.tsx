import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '@/types/hospital';

interface RoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
