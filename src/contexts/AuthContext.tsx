import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';

export type StaffRole = 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'pharmacist' | 'accountant';

export interface StaffMe {
  kind: 'staff';
  role: StaffRole;
  staff: { id: number; staffNumber: string; fullName: string; role: StaffRole };
}

interface AuthContextType {
  me: StaffMe | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginStaff: (email: string, password: string) => Promise<StaffMe>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ME_QUERY_KEY = ['auth', 'me'] as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: me, isLoading } = useQuery<StaffMe | undefined>({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => {
      try {
        return await api.get<StaffMe>('/auth/me');
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) return undefined;
        throw err;
      }
    },
    retry: false,
    staleTime: 60_000,
  });

  const loginStaffMutation = useMutation({
    mutationFn: (vars: { email: string; password: string }) => api.post<StaffMe>('/auth/staff/login', vars),
    onSuccess: (data) => queryClient.setQueryData(ME_QUERY_KEY, data),
  });

  const logoutMutation = useMutation({
    mutationFn: () => api.post<{ success: boolean }>('/auth/logout'),
    onSuccess: () => queryClient.setQueryData(ME_QUERY_KEY, undefined),
  });

  return (
    <AuthContext.Provider
      value={{
        me,
        isLoading,
        isAuthenticated: !!me,
        loginStaff: (email, password) => loginStaffMutation.mutateAsync({ email, password }),
        logout: async () => {
          await logoutMutation.mutateAsync();
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
