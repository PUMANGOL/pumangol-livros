import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { signUp } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './LoginPage.css';

interface SignUpForm {
  name: string;
  email: string;
  msisdn: string;
  password: string;
  confirmPassword: string;
}

const initialForm: SignUpForm = {
  name: '',
  email: '',
  msisdn: '',
  password: '',
  confirmPassword: '',
};

export function SignUpPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState<SignUpForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const updateField = <K extends keyof SignUpForm>(key: K, value: SignUpForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SignUpForm, string>> = {};

    if (!form.name.trim()) newErrors.name = 'Obrigatório';
    if (!form.email.trim()) newErrors.email = 'Obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email inválido';

    if (!form.msisdn.trim()) newErrors.msisdn = 'Obrigatório';
    else if (!/^\d{9}$/.test(form.msisdn.replace(/\s/g, ''))) {
      newErrors.msisdn = 'Telefone inválido (9 dígitos)';
    }

    if (!form.password) newErrors.password = 'Obrigatório';
    else if (form.password.length < 6) newErrors.password = 'Mínimo de 6 caracteres';

    if (!form.confirmPassword) newErrors.confirmPassword = 'Obrigatório';
    else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'As palavras-passe não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      const email = form.email.trim();
      const password = form.password;
      const msisdn = form.msisdn.replace(/\s/g, '');

      await signUp({
        name: form.name.trim(),
        email,
        password,
        msisdn,
      });

      await login(email, password);
      showToast('Conta criada com sucesso!');
      navigate('/', { replace: true });
    } catch {
      showToast('Não foi possível criar a conta. Verifique os dados e tente novamente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card auth-card--wide">
        <div className="login-brand">
          <img src="/logo-pumangol.svg" alt="Pumangol" />
          <h1>Criar conta</h1>
          <p>Registe-se para fazer encomendas na campanha escolar.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-name">Nome completo</label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Ex: Maria da Silva"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Ex: maria@email.com"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-msisdn">Telefone</label>
            <input
              id="signup-msisdn"
              type="tel"
              autoComplete="tel"
              className={`form-input ${errors.msisdn ? 'error' : ''}`}
              value={form.msisdn}
              onChange={(e) => updateField('msisdn', e.target.value)}
              placeholder="Ex: 923456789"
            />
            {errors.msisdn && <span className="form-error">{errors.msisdn}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">Palavra-passe</label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="Mínimo de 6 caracteres"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-confirm-password">Confirmar palavra-passe</label>
            <input
              id="signup-confirm-password"
              type="password"
              autoComplete="new-password"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              value={form.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              placeholder="Repita a palavra-passe"
            />
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block login-submit" disabled={submitting}>
            {submitting ? 'A criar conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="login-footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>

        <p className="login-footer">
          <Link to="/">Voltar à página inicial</Link>
        </p>
      </div>
    </div>
  );
}
