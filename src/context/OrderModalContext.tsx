import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderFormModal } from '../components/order/OrderFormModal';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface OrderModalContextValue {
  openOrderModal: () => void;
  closeOrderModal: () => void;
  isOrderModalOpen: boolean;
}

const OrderModalContext = createContext<OrderModalContextValue | null>(null);

function getOrderReturnPath() {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: '#encomenda',
  };
}

export function OrderModalProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const redirectToLogin = useCallback(() => {
    showToast('Deve fazer login para fazer uma encomenda.', 'error');
    navigate('/login', { state: { from: getOrderReturnPath() } });
  }, [navigate, showToast]);

  const openOrderModal = useCallback(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    setIsOpen(true);
    window.history.replaceState(null, '', '#encomenda');
  }, [isAuthenticated, isLoading, redirectToLogin]);

  const closeOrderModal = useCallback(() => {
    setIsOpen(false);
    if (window.location.hash === '#encomenda') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      if (window.location.hash !== '#encomenda') return;

      if (isLoading) return;

      if (!isAuthenticated) {
        redirectToLogin();
        return;
      }

      setIsOpen(true);
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [isAuthenticated, isLoading, redirectToLogin]);

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
