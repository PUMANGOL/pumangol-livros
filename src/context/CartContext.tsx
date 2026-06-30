import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { Book, CartItem, Order, CustomerData } from '../types';
import { useToast } from './ToastContext';
import {
  buildCreateOrderPayload,
  createOrder,
  mapApiOrderToOrder,
} from '../api/orders';

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  orders: Order[];
  submitOrder: (customer: CustomerData, cartItems?: CartItem[]) => Promise<Order>;
}

const CartContext = createContext<CartContextType | null>(null);

const ORDERS_KEY = 'pumangol-livros-orders';

function loadOrders(): Order[] {
  try {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function CartProviderContent({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const itemsRef = useRef(items);

  itemsRef.current = items;

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const addToCart = useCallback((book: Book) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.book.id === book.id);
      if (existing) {
        return prev.map((i) =>
          i.book.id === book.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
    showToast('Adicionado ao carrinho');
  }, [showToast]);

  const removeFromCart = useCallback((bookId: string) => {
    setItems((prev) => prev.filter((i) => i.book.id !== bookId));
  }, []);

  const updateQuantity = useCallback((bookId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.book.id !== bookId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.book.id === bookId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.book.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const submitOrder = useCallback(
    async (customer: CustomerData, cartItems?: CartItem[]): Promise<Order> => {
      const orderItems = cartItems ?? itemsRef.current;
      const orderTotal = orderItems.reduce((sum, i) => sum + i.book.price * i.quantity, 0);
      const payload = buildCreateOrderPayload(customer, orderItems);
      const apiOrder = await createOrder(payload);
      const order = mapApiOrderToOrder(apiOrder, customer, orderItems, orderTotal);

      setOrders((prev) => [order, ...prev]);
      clearCart();

      return order;
    },
    [clearCart],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        orders,
        submitOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  return <CartProviderContent>{children}</CartProviderContent>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export function updateOrderStatus(orderId: string, status: Order['status']) {
  const orders = loadOrders();
  const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  return updated;
}
