import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { OrderModalProvider } from '../../context/OrderModalContext';

export function Layout() {
  const { pathname } = useLocation();
  const hideFooter = pathname.startsWith('/backoffice');

  return (
    <OrderModalProvider>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </OrderModalProvider>
  );
}
