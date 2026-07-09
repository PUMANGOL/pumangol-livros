import { useQuery } from '@tanstack/react-query';
import { fetchOrderById } from '../api/orders';

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(Number(id)),
    enabled: !!id && !Number.isNaN(Number(id)),
    staleTime: 30_000,
    retry: 1,
  });
}
