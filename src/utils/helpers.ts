import * as XLSX from 'xlsx';

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function getBookCoverImageUrl(
  src: string | null | undefined,
  width = 500,
  height = 500,
): string | undefined {
  if (!src?.trim()) return undefined;

  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}width=${width}&height=${height}`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-AO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export function exportOrdersToXlsx(orders: {
  id: number | string;
  customer: { fullName: string; phone: string; email: string; location: string };
  pickupPost: string;
  total: number;
  status: string;
  createAt: string;
  items: { book: string; quantity: number }[];
}[]): void {
  const headers = ['ID', 'Cliente', 'Telefone', 'Email', 'Localização', 'Posto', 'Total', 'Estado', 'Data', 'Livros'];
  const rows = orders.map((o) => [
    String(o.id),
    o.customer.fullName,
    o.customer.phone,
    o.customer.email,
    o.customer.location,
    o.pickupPost,
    o.total,
    o.status,
    o.createAt,
    o.items.map((i) => `${i.book} (x${i.quantity})`).join('; '),
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Encomendas');
  XLSX.writeFile(workbook, `encomendas-pumangol-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
