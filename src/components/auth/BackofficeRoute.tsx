import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface BackofficeRouteProps {
  children: ReactNode;
}

function BackofficeAccessDenied() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    showToast('Não tem permissão para aceder ao backoffice.', 'error');
    navigate('/', { replace: true });
  }, [navigate, showToast]);

  return (
    <div className="auth-loading">
      <p>A redirecionar...</p>
    </div>
  );
}

export function BackofficeRoute({ children }: BackofficeRouteProps) {
  const { isAuthenticated, canAccessBackoffice, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="auth-loading">
        <p>A verificar sessão...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!canAccessBackoffice) {
    return <BackofficeAccessDenied />;
  }

  return children;
}
