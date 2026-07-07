import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface ApiDepartment {
  id: number;
  name: string;
  description: string | null;
}

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get<ApiDepartment[]>('/departments'),
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; description?: string }) => api.post<ApiDepartment>('/departments', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
}
