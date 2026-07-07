import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface ApiStaff {
  id: number;
  staff_number: string;
  full_name: string;
  role: string;
  specialization: string | null;
  department_id: number | null;
  phone: string | null;
  email: string | null;
  hire_date: string | null;
  contract_type: string | null;
  employment_status: 'active' | 'on-leave' | 'terminated';
  base_salary: number | null;
  emergency_contact: string | null;
  address: string | null;
  schedule_note: string | null;
  is_available: number;
  created_at: string;
}

export interface StaffInput {
  fullName: string;
  role: string;
  specialization?: string;
  departmentId?: number;
  phone?: string;
  email?: string;
  hireDate?: string;
  contractType?: string;
  baseSalary?: number;
  emergencyContact?: string;
  address?: string;
  scheduleNote?: string;
  password?: string;
}

export function useStaffList(params?: { search?: string; role?: string; departmentId?: number }) {
  const qs = new URLSearchParams();
  if (params?.search) qs.set('search', params.search);
  if (params?.role) qs.set('role', params.role);
  if (params?.departmentId) qs.set('departmentId', String(params.departmentId));
  const query = qs.toString();

  return useQuery({
    queryKey: ['staff', params ?? {}],
    queryFn: () => api.get<ApiStaff[]>(`/staff${query ? `?${query}` : ''}`),
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: StaffInput) => api.post<ApiStaff>('/staff', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: Partial<StaffInput> & { id: number; isAvailable?: boolean; employmentStatus?: string }) =>
      api.patch<ApiStaff>(`/staff/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<{ success: boolean }>(`/staff/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
  });
}
