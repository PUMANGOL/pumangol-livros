export const ORDER_STATUSES = [
  'Pendente',
  'Em Processamento',
  'Pronto para Entrega',
  'Entregue',
  'Cancelado',
] as const;

export type OrderApiStatus = (typeof ORDER_STATUSES)[number];

/** Display label — the API already returns Portuguese text, so this is an identity map.
 *  Kept for compatibility with any place that does orderStatusLabels[status]. */
export const orderStatusLabels: Record<string, string> = {
  Pendente: 'Pendente',
  'Em Processamento': 'Em Processamento',
  'Pronto para Entrega': 'Pronto para Entrega',
  Entregue: 'Entregue',
  Cancelado: 'Cancelado',
};

export const orderStatusColors: Record<string, string> = {
  Pendente: 'badge-yellow',
  'Em Processamento': 'badge-blue',
  'Pronto para Entrega': 'badge-green',
  Entregue: 'badge-green',
  Cancelado: 'badge-red',
};

export const orderStatusOptions = ORDER_STATUSES.map((status) => ({
  value: status,
  label: status,
}));

/** Options available in the backoffice row status-change dropdown.
 *  value is the numeric statusId sent to PUT /order/{id}/status */
export const backofficeUpdateStatusOptions = [
  { value: '4', label: 'Em Processamento' },
  { value: '5', label: 'Pronto para Entrega' },
];
