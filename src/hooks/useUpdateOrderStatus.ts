import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderStatus } from '../api/orders';
import type { ApiOrderDetail } from '../types/api';

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ order, statusId }: { order: ApiOrderDetail; statusId: number }) =>
      updateOrderStatus(order.id, statusId),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData<ApiOrderDetail[]>(['orders'], (current = []) =>
        current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)),
      );
    },
  });
}
