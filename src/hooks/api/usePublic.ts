import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface PublicDepartment {
  id: number;
  name: string;
  description: string | null;
}

export interface PublicDoctor {
  id: number;
  full_name: string;
  specialization: string | null;
  department_id: number | null;
}

export function usePublicDepartments() {
  return useQuery({
    queryKey: ['public', 'departments'],
    queryFn: () => api.get<PublicDepartment[]>('/public/departments'),
  });
}

export function usePublicDoctors() {
  return useQuery({
    queryKey: ['public', 'doctors'],
    queryFn: () => api.get<PublicDoctor[]>('/public/doctors'),
  });
}
