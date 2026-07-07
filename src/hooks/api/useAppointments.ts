import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface ApiAppointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  department_id: number | null;
  scheduled_date: string;
  scheduled_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  reason: string | null;
  notes: string | null;
  booked_via: string;
  patient_name: string;
  patient_number: string;
  doctor_name: string;
}

export interface AppointmentInput {
  patientId: number;
  doctorId: number;
  departmentId?: number;
  scheduledDate: string;
  scheduledTime: string;
  reason?: string;
  notes?: string;
  status?: string;
}

export function useAppointments(params?: { date?: string; doctorId?: number; patientId?: number; status?: string }) {
  const qs = new URLSearchParams();
  if (params?.date) qs.set('date', params.date);
  if (params?.doctorId) qs.set('doctorId', String(params.doctorId));
  if (params?.patientId) qs.set('patientId', String(params.patientId));
  if (params?.status) qs.set('status', params.status);
  const query = qs.toString();

  return useQuery({
    queryKey: ['appointments', params ?? {}],
    queryFn: () => api.get<ApiAppointment[]>(`/appointments${query ? `?${query}` : ''}`),
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AppointmentInput) => api.post<ApiAppointment>('/appointments', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: Partial<AppointmentInput> & { id: number }) =>
      api.patch<ApiAppointment>(`/appointments/${id}`, input),
    onMutate: async ({ id, status }) => {
      if (!status) return;
      await queryClient.cancelQueries({ queryKey: ['appointments'] });
      const previous = queryClient.getQueriesData<ApiAppointment[]>({ queryKey: ['appointments'] });
      queryClient.setQueriesData<ApiAppointment[]>({ queryKey: ['appointments'] }, (old) =>
        old?.map((a) => (a.id === id ? { ...a, status: status as ApiAppointment['status'] } : a))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      context?.previous?.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<{ success: boolean }>(`/appointments/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  });
}
