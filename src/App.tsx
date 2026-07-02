import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/layout/Layout';
import { BackofficeRoute } from './components/auth/BackofficeRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { BackofficeLayout } from './components/backoffice/BackofficeLayout';
import { BackofficeOrdersPage } from './pages/backoffice/BackofficeOrdersPage';
import { BackofficeBooksPage } from './pages/backoffice/BackofficeBooksPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="login" element={<LoginPage />} />
              <Route path="cadastro" element={<SignUpPage />} />
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="catalogo" element={<Navigate to="/#catalogo" replace />} />
                <Route path="encomenda" element={<Navigate to="/#encomenda" replace />} />
                <Route path="confirmacao/:orderId" element={<ConfirmationPage />} />
                <Route
                  path="backoffice"
                  element={(
                    <BackofficeRoute>
                      <BackofficeLayout />
                    </BackofficeRoute>
                  )}
                >
                  <Route index element={<Navigate to="encomendas" replace />} />
                  <Route path="encomendas" element={<BackofficeOrdersPage />} />
                  <Route path="livros" element={<BackofficeBooksPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
