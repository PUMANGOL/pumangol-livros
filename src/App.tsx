import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { BackofficePage } from './pages/BackofficePage';

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="catalogo" element={<Navigate to="/#catalogo" replace />} />
            <Route path="encomenda" element={<Navigate to="/#encomenda" replace />} />
            <Route path="confirmacao/:orderId" element={<ConfirmationPage />} />
            <Route path="backoffice" element={<BackofficePage />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
