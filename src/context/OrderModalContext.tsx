import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { OrderFormModal } from '../components/order/OrderFormModal';

interface OrderModalContextValue {
  openOrderModal: () => void;
  closeOrderModal: () => void;
  isOrderModalOpen: boolean;
}

const OrderModalContext = createContext<OrderModalContextValue | null>(null);

export function OrderModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openOrderModal = useCallback(() => {
    setIsOpen(true);
    window.history.replaceState(null, '', '#encomenda');
  }, []);

  const closeOrderModal = useCallback(() => {
    setIsOpen(false);
    if (window.location.hash === '#encomenda') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      if (window.location.hash === '#encomenda') {
        setIsOpen(true);
      }
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  return (
    <OrderModalContext.Provider
      value={{ openOrderModal, closeOrderModal, isOrderModalOpen: isOpen }}
    >
      {children}
      <OrderFormModal isOpen={isOpen} onClose={closeOrderModal} />
    </OrderModalContext.Provider>
  );
}

export function useOrderModal() {
  const ctx = useContext(OrderModalContext);
  if (!ctx) {
    throw new Error('useOrderModal must be used within OrderModalProvider');
  }
  return ctx;
}
