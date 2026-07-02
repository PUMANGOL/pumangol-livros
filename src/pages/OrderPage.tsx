import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { usePickupPosts } from '../hooks/usePickupPosts';
import { formatPrice } from '../utils/helpers';
import { Select } from '../components/ui/Select';
import { BookCover } from '../components/catalog/BookCover';
import type { CustomerData } from '../types';
import './OrderPage.css';

const initialForm: CustomerData = {
  fullName: '',
  phone: '',
  email: '',
  location: '',
  pickupPostId: '',
  notes: '',
  termsAccepted: false,
};

export function OrderPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, total, submitOrder } = useCart();
  const { showToast } = useToast();
  const { data: pickupPosts = [], isLoading: isPickupPostsLoading } = usePickupPosts();
  const [form, setForm] = useState<CustomerData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerData, string>> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Nome completo é obrigatório';
    if (!form.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    else if (!/^(\+244\s?)?9\d{2}\s?\d{3}\s?\d{3}$/.test(form.phone.replace(/\s/g, '')))
      newErrors.phone = 'Formato: 9XX XXX XXX';
    if (!form.email.trim()) newErrors.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Email inválido';
    if (!form.location.trim()) newErrors.location = 'Localização é obrigatória';
    if (!form.pickupPostId) newErrors.pickupPostId = 'Selecione um posto de levantamento';
    if (!form.termsAccepted) newErrors.termsAccepted = 'Deve aceitar os termos';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validate()) return;

    setSubmitting(true);

    try {
      const selectedPost = pickupPosts.find((post) => String(post.id) === form.pickupPostId);
      const order = await submitOrder(
        {
          ...form,
          pickupPostName: selectedPost?.name,
        },
        [...items],
      );
      showToast('Encomenda submetida com sucesso!');
      navigate(`/confirmacao/${order.id}`, { state: { order } });
    } catch {
      showToast('Não foi possível submeter a encomenda. Tente novamente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = <K extends keyof CustomerData>(key: K, value: CustomerData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  if (items.length === 0) {
    return (
      <div className="order-page">
        <div className="container order-empty">
          <ShoppingBag size={64} className="order-empty-icon" />
          <h2>A sua encomenda está vazia</h2>
          <p>Adicione livros do catálogo para continuar.</p>
          <Link to="/catalogo" className="btn btn-primary btn-lg">
            Ver Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="order-page-header">
        <div className="container">
          <h1 className="section-title">Finalizar Encomenda</h1>
          <p className="section-subtitle">
            Preencha os seus dados e escolha o posto de levantamento.
          </p>
        </div>
      </div>

      <div className="container order-layout">
        <form className="order-form" onSubmit={handleSubmit}>
          <section className="order-section">
            <h2 className="order-section-title">Dados do Cliente</h2>
            <div className="order-form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Nome Completo *</label>
                <input
                  id="fullName"
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Ex: Maria da Silva"
                />
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">Telefone *</label>
                <input
                  id="phone"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="Ex: 923 456 789"
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="Ex: maria@email.com"
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="location">Localização *</label>
                <input
                  id="location"
                  className={`form-input ${errors.location ? 'error' : ''}`}
                  value={form.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="Ex: Luanda, Talatona"
                />
                {errors.location && <span className="form-error">{errors.location}</span>}
              </div>

              <div className="form-group form-group-full">
                <label className="form-label" htmlFor="pickupPostId">Posto de Levantamento *</label>
                <Select
                  id="pickupPostId"
                  value={form.pickupPostId}
                  onChange={(v) => updateField('pickupPostId', v)}
                  disabled={isPickupPostsLoading}
                  placeholder={isPickupPostsLoading ? 'A carregar postos...' : 'Selecione um posto...'}
                  error={!!errors.pickupPostId}
                  options={pickupPosts.map((post) => ({
                    value: String(post.id),
                    label: post.name,
                  }))}
                />
                {errors.pickupPostId && <span className="form-error">{errors.pickupPostId}</span>}
              </div>
            </div>
          </section>

          <section className="order-section">
            <h2 className="order-section-title">Observações</h2>
            <div className="form-group">
              <textarea
                className="form-textarea"
                value={form.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Informações adicionais sobre a sua encomenda (opcional)..."
              />
            </div>
          </section>

          <section className="order-section">
            <label className="order-consent">
              <input
                type="checkbox"
                checked={form.termsAccepted}
                onChange={(e) => updateField('termsAccepted', e.target.checked)}
              />
              <span>
                Aceito os termos e condições da campanha Bom Regresso às Aulas 2026 e autorizo o
                tratamento dos meus dados para processamento da encomenda e envio de notificações
                por Email e WhatsApp.
              </span>
            </label>
            {errors.termsAccepted && (
              <span className="form-error">{errors.termsAccepted}</span>
            )}
          </section>

          <button
            type="submit"
            className="btn btn-primary btn-lg order-submit"
            disabled={submitting}
          >
            {submitting ? 'A processar...' : 'Finalizar Encomenda'}
            {!submitting && <ArrowRight size={20} />}
          </button>
        </form>

        <aside className="order-summary">
          <h2 className="order-summary-title">Resumo da Encomenda</h2>

          <ul className="order-items">
            {items.map(({ book, quantity }) => (
              <li key={book.id} className="order-item">
                <BookCover
                  title={book.title}
                  src={book.coverImage}
                  className="order-item-cover"
                />
                <div className="order-item-info">
                  <h4>{book.title}</h4>
                  <p>{book.grade} · {book.category}</p>
                  <span className="order-item-price">{formatPrice(book.price)}</span>
                </div>
                <div className="order-item-actions">
                  <div className="order-qty">
                    <button
                      type="button"
                      onClick={() => updateQuantity(book.id, quantity - 1)}
                      aria-label="Diminuir quantidade"
                    >
                      <Minus size={14} />
                    </button>
                    <span>{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(book.id, quantity + 1)}
                      aria-label="Aumentar quantidade"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="order-item-remove"
                    onClick={() => removeFromCart(book.id)}
                    aria-label="Remover livro"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="order-total">
            <span>Total estimado</span>
            <span className="order-total-value">{formatPrice(total)}</span>
          </div>

          <p className="order-summary-note">
            O valor final pode variar consoante disponibilidade. Receberá confirmação por Email e WhatsApp.
          </p>
        </aside>
      </div>
    </div>
  );
}
