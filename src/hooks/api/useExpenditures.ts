import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface ApiExpenditure {
  id: number;
  reference_number: string;
  category: string;
  description: string;
  amount: number;
  expense_date: string;
  vendor: string | null;
  payment_method: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  created_at: string;
}

export interface ExpenditureInput {
  category: string;
  description: string;
  amount: number;
  expenseDate?: string;
  vendor?: string;
  paymentMethod?: string;
  status?: string;
}

export function useExpenditures(params?: { status?: string; category?: string }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.category) qs.set('category', params.category);
  const query = qs.toString();

  return useQuery({
    queryKey: ['expenditures', params ?? {}],
    queryFn: () => api.get<ApiExpenditure[]>(`/expenditures${query ? `?${query}` : ''}`),
  });
}

export function useCreateExpenditure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ExpenditureInput) => api.post<ApiExpenditure>('/expenditures', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expenditures'] }),
  });
}

export function useUpdateExpenditure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: Partial<ExpenditureInput> & { id: number }) =>
      api.patch<ApiExpenditure>(`/expenditures/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expenditures'] }),
  });
}

export function useDeleteExpenditure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<{ success: boolean }>(`/expenditures/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expenditures'] }),
  });
}
