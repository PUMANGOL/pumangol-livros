import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { OrderModalProvider } from '../../context/OrderModalContext';

export function Layout() {
  const { pathname } = useLocation();
  const isBackoffice = pathname.startsWith('/backoffice');
  const hideFooter = isBackoffice;

  return (
    <OrderModalProvider>
      {!isBackoffice && <Header />}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </OrderModalProvider>
  );
}
