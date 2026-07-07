import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface ApiLeaveRequest {
  id: number;
  staff_id: number;
  staff_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  approved_by_staff_id: number | null;
  approved_at: string | null;
}

export interface ApiAttendanceRecord {
  id: number;
  staff_id: number;
  staff_name: string;
  work_date: string;
  clock_in: string | null;
  clock_out: string | null;
  hours_worked: number | null;
  status: 'present' | 'absent' | 'late' | 'half-day';
}

export interface ApiPayrollRecord {
  id: number;
  staff_id: number;
  staff_name: string;
  period_month: string;
  base_salary: number;
  allowances_json: string;
  deductions_json: string;
  overtime_hours: number;
  overtime_rate: number;
  gross_salary: number;
  net_salary: number;
  status: 'pending' | 'processed' | 'paid';
  processed_at: string | null;
  paid_at: string | null;
}

export function useLeaveRequests(status?: string) {
  return useQuery({
    queryKey: ['hr', 'leave-requests', status ?? ''],
    queryFn: () => api.get<ApiLeaveRequest[]>(`/hr/leave-requests${status ? `?status=${status}` : ''}`),
  });
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { staffId: number; leaveType: string; startDate: string; endDate: string; reason?: string }) =>
      api.post<ApiLeaveRequest>('/hr/leave-requests', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr', 'leave-requests'] }),
  });
}

export function useUpdateLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => api.patch<ApiLeaveRequest>(`/hr/leave-requests/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr', 'leave-requests'] }),
  });
}

export function useAttendance(date?: string) {
  return useQuery({
    queryKey: ['hr', 'attendance', date ?? ''],
    queryFn: () => api.get<ApiAttendanceRecord[]>(`/hr/attendance${date ? `?date=${date}` : ''}`),
  });
}

export function usePayroll(month?: string) {
  return useQuery({
    queryKey: ['hr', 'payroll', month ?? ''],
    queryFn: () => api.get<ApiPayrollRecord[]>(`/hr/payroll${month ? `?month=${month}` : ''}`),
  });
}

export function useCreatePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      staffId: number;
      periodMonth: string;
      baseSalary: number;
      allowances?: Record<string, number>;
      deductions?: Record<string, number>;
      overtimeHours?: number;
      overtimeRate?: number;
    }) => api.post<ApiPayrollRecord>('/hr/payroll', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr', 'payroll'] }),
  });
}

export function useUpdatePayrollStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => api.patch<ApiPayrollRecord>(`/hr/payroll/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr', 'payroll'] }),
  });
}
