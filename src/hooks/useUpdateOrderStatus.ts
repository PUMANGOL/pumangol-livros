import { useMutation, useQueryClient } from '@tanstack/react-query';
import { buildUpdateOrderPayload, updateOrder } from '../api/orders';
import type { ApiOrderDetail } from '../types/api';

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ order, status }: { order: ApiOrderDetail; status: string }) =>
      updateOrder(order.id, buildUpdateOrderPayload(order, status)),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData<ApiOrderDetail[]>(['orders'], (current = []) =>
        current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)),
      );
    },
  });
}
