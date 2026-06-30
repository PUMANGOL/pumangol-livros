export const ORDER_STATUSES = [
  'PENDING',
  'ACTIVATED',
  'PREPARING',
  'READY_FOR_PICKUP',
  'DELIVERED',
  'CANCELLED',
] as const;

export type OrderApiStatus = (typeof ORDER_STATUSES)[number];

export const orderStatusLabels: Record<string, string> = {
  PENDING: 'Pendente',
  ACTIVATED: 'Confirmado',
  PREPARING: 'Em preparação',
  READY_FOR_PICKUP: 'Pronto para levantamento',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

export const orderStatusColors: Record<string, string> = {
  PENDING: 'badge-yellow',
  ACTIVATED: 'badge-green',
  PREPARING: 'badge-blue',
  READY_FOR_PICKUP: 'badge-blue',
  DELIVERED: 'badge-green',
  CANCELLED: 'badge-red',
};

export const orderStatusOptions = ORDER_STATUSES.map((status) => ({
  value: status,
  label: orderStatusLabels[status],
}));
