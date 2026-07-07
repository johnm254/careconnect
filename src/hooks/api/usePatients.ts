import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface ApiPatient {
  id: number;
  patient_number: string;
  id_number: string | null;
  full_name: string;
  date_of_birth: string | null;
  age: number | null;
  gender: string | null;
  phone: string;
  address: string | null;
  blood_group: string | null;
  emergency_contact: string | null;
  insurance_id: string | null;
  assigned_doctor_id: number | null;
  assigned_nurse_id: number | null;
  portal_enabled: number;
  registered_at: string;
  last_visit_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PatientInput {
  fullName: string;
  idNumber?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  phone: string;
  address?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  insuranceId?: string;
  assignedDoctorId?: number;
}

export function usePatients(search?: string) {
  return useQuery({
    queryKey: ['patients', search ?? ''],
    queryFn: () => api.get<ApiPatient[]>(`/patients${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PatientInput) => api.post<ApiPatient>('/patients', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: Partial<PatientInput> & { id: number }) => api.patch<ApiPatient>(`/patients/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<{ success: boolean }>(`/patients/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
  });
}
