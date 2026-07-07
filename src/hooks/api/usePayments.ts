import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface ApiPayment {
  id: number;
  invoice_number: string;
  patient_id: number;
  patient_name: string;
  patient_number: string;
  issued_date: string;
  due_date: string | null;
  subtotal: number;
  tax: number;
  total: number;
  amount_paid: number;
  status: 'pending' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
  payment_method: string | null;
  paid_at: string | null;
}

export interface PaymentItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface PaymentInput {
  patientId: number;
  dueDate?: string;
  tax?: number;
  paymentMethod?: string;
  items: PaymentItemInput[];
}

export function usePayments(status?: string) {
  return useQuery({
    queryKey: ['payments', status ?? ''],
    queryFn: () => api.get<ApiPayment[]>(`/payments${status ? `?status=${status}` : ''}`),
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PaymentInput) => api.post<ApiPayment>('/payments', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] }),
  });
}

export function useMarkPaymentPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.patch<ApiPayment>(`/payments/${id}`, { markPaid: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] }),
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: number; amountPaid?: number; paymentMethod?: string; status?: string }) =>
      api.patch<ApiPayment>(`/payments/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] }),
  });
}

export function useVoidPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<{ success: boolean }>(`/payments/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] }),
  });
}
