import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface ApiInventoryItem {
  id: number;
  sku: string;
  name: string;
  category: 'drug' | 'consumable' | 'equipment' | 'other';
  unit: string;
  quantity_on_hand: number;
  reorder_level: number;
  unit_cost: number;
  supplier: string | null;
  batch_number: string | null;
  expiry_date: string | null;
  requires_expiry_tracking: number;
}

export interface InventoryItemInput {
  sku: string;
  name: string;
  category: string;
  unit: string;
  quantityOnHand?: number;
  reorderLevel?: number;
  unitCost?: number;
  supplier?: string;
  batchNumber?: string;
  expiryDate?: string;
  requiresExpiryTracking?: boolean;
}

export interface InventoryAlerts {
  lowStock: ApiInventoryItem[];
  expiring: ApiInventoryItem[];
}

export function useInventory(params?: { category?: string; search?: string }) {
  const qs = new URLSearchParams();
  if (params?.category) qs.set('category', params.category);
  if (params?.search) qs.set('search', params.search);
  const query = qs.toString();

  return useQuery({
    queryKey: ['inventory', params ?? {}],
    queryFn: () => api.get<ApiInventoryItem[]>(`/inventory${query ? `?${query}` : ''}`),
  });
}

export function useInventoryAlerts() {
  return useQuery({
    queryKey: ['inventory', 'alerts'],
    queryFn: () => api.get<InventoryAlerts>('/inventory/alerts'),
  });
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: InventoryItemInput) => api.post<ApiInventoryItem>('/inventory', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory'] }),
  });
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: Partial<InventoryItemInput> & { id: number }) =>
      api.patch<ApiInventoryItem>(`/inventory/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory'] }),
  });
}

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<{ success: boolean }>(`/inventory/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory'] }),
  });
}

export function useInventoryTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: number; type: string; quantity: number; reason?: string }) =>
      api.post<ApiInventoryItem>(`/inventory/${id}/transactions`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory'] }),
  });
}
