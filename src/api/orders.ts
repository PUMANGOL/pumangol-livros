import { apiClient } from './client';
import type { ApiResponse, ApiOrder, ApiOrderDetail, CreateOrderPayload, Page } from '../types/api';
import type { CartItem, CustomerData, Order } from '../types';

export function getOrderTotal(order: Pick<ApiOrderDetail, 'items'>): number {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export async function fetchOrders(): Promise<ApiOrderDetail[]> {
  const all: ApiOrderDetail[] = [];
  let page = 0;
  let last = false;

  while (!last) {
    const { data } = await apiClient.get<ApiResponse<Page<ApiOrderDetail>>>('/order', {
      params: { page, size: 50 },
    });

    const pageData = data.data;
    all.push(...pageData.content);
    last = pageData.last;
    page += 1;
  }

  return all;
}

export function buildUpdateOrderPayload(
  order: ApiOrderDetail,
  status: string,
): CreateOrderPayload {
  return {
    customer: {
      fullName: order.customer.fullName,
      phone: order.customer.phone,
      email: order.customer.email,
      location: order.customer.location,
    },
    pickupPostId: order.pickupPostId,
    notes: order.notes ?? '',
    items: order.items.map((item) => ({
      bookId: item.bookId,
      quantity: item.quantity,
    })),
    status,
  };
}

export async function updateOrder(
  id: number,
  payload: CreateOrderPayload,
): Promise<ApiOrderDetail> {
  const { data } = await apiClient.put<ApiResponse<ApiOrderDetail>>(`/order/${id}`, payload);

  return data.data;
}

export function buildCreateOrderPayload(
  customer: CustomerData,
  items: CartItem[],
): CreateOrderPayload {
  const orderItems = items
    .filter((item) => item.quantity > 0 && Number.isFinite(Number(item.book.id)))
    .map((item) => ({
      bookId: Number(item.book.id),
      quantity: item.quantity,
    }));

  return {
    customer: {
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email,
      location: customer.location,
    },
    pickupPostId: Number(customer.pickupPostId),
    notes: customer.notes,
    items: orderItems,
  };
}

export async function createOrder(payload: CreateOrderPayload): Promise<ApiOrder> {
  const { data } = await apiClient.post<ApiResponse<ApiOrder>>('/order', payload);

  return data.data;
}

export function mapApiOrderToOrder(
  apiOrder: ApiOrder,
  customer: CustomerData,
  items: CartItem[],
  total: number,
): Order {
  return {
    id: String(apiOrder.id),
    customer,
    items: [...items],
    total: apiOrder.total ?? total,
    status: 'pendente',
    createdAt: apiOrder.createdAt ?? new Date().toISOString(),
  };
}
