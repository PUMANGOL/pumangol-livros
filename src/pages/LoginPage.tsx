import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { canAccessBackoffice as userCanAccessBackoffice } from '../utils/auth';
import './LoginPage.css';

interface LoginForm {
  email: string;
  password: string;
}

const initialForm: LoginForm = {
  email: '',
  password: '',
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, canAccessBackoffice } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState<LoginForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from as
    | { pathname?: string; search?: string; hash?: string }
    | undefined;

  if (!isLoading && isAuthenticated) {
    const redirectTo = from?.pathname?.startsWith('/backoffice') && !canAccessBackoffice
      ? '/'
      : from
        ? `${from.pathname ?? '/'}${from.search ?? ''}${from.hash ?? ''}`
        : '/';

    return <Navigate to={redirectTo} replace />;
  }

  const updateField = <K extends keyof LoginForm>(key: K, value: LoginForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LoginForm, string>> = {};

    if (!form.email.trim()) newErrors.email = 'Obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email inválido';

    if (!form.password) newErrors.password = 'Obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      const user = await login(form.email.trim(), form.password);
      showToast('Sessão iniciada com sucesso!');

      const wantsBackoffice = from?.pathname?.startsWith('/backoffice');

      if (wantsBackoffice && !userCanAccessBackoffice(user)) {
        showToast('Não tem permissão para aceder ao backoffice.', 'error');
        navigate('/', { replace: true });
        return;
      }

      const redirectTo = from
        ? `${from.pathname ?? '/'}${from.search ?? ''}${from.hash ?? ''}`
        : '/';

      navigate(redirectTo, { replace: true });
    } catch {
      showToast('Email ou palavra-passe incorretos.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <img src="/logo-pumangol.svg" alt="Pumangol" />
          <h1>Iniciar sessão</h1>
          <p>Inicie sessão para fazer encomendas na campanha escolar.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Ex: utilizador@pumangol.co.ao"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Palavra-passe</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="Introduza a sua palavra-passe"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block login-submit" disabled={submitting}>
            <LogIn size={18} />
            {submitting ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <p className="login-footer">
          Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
        </p>

        <p className="login-footer">
          <Link to="/">Voltar à página inicial</Link>
        </p>
      </div>
    </div>
  );
}
