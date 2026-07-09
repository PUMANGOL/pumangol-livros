import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { usePickupPosts } from '../../hooks/usePickupPosts';
import { Select } from '../ui/Select';
import type { CustomerData } from '../../types';
import './OrderFormSection.css';

export function OrderFormSection({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const { items, submitOrder } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { data: pickupPosts = [], isLoading: isPickupPostsLoading } = usePickupPosts();
  const [form, setForm] = useState<CustomerData>({
    fullName: user?.name ?? '',
    phone: user?.msisdn ?? '',
    email: user?.email ?? '',
    location: '',
    pickupPostId: '',
    notes: '',
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerData, string>> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Obrigatório';
    if (!form.phone.trim()) newErrors.phone = 'Obrigatório';
    if (!form.email.trim()) newErrors.email = 'Obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email inválido';
    if (!form.location.trim()) newErrors.location = 'Obrigatório';
    if (!form.pickupPostId) newErrors.pickupPostId = 'Selecione um posto';
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
      onClose?.();
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

  return (
    <form className="order-form" onSubmit={handleSubmit}>
        <div className="order-form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Nome completo</label>
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
            <label className="form-label" htmlFor="phone">Telefone</label>
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
            <label className="form-label" htmlFor="email">Email</label>
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
            <label className="form-label" htmlFor="location">Localização</label>
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
            <label className="form-label" htmlFor="pickupPostId">Posto de levantamento</label>
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

          <div className="form-group form-group-full">
            <label className="form-label" htmlFor="notes">Observações</label>
            <textarea
              id="notes"
              className="form-textarea"
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Informações adicionais (opcional)..."
            />
          </div>
        </div>

        <label className="order-consent">
          <input
            type="checkbox"
            checked={form.termsAccepted}
            onChange={(e) => updateField('termsAccepted', e.target.checked)}
          />
          <span>
            Confirmo que os dados fornecidos são correctos e autorizo o tratamento para processamento
            da encomenda e envio de notificações por Email e WhatsApp.
          </span>
        </label>
        {errors.termsAccepted && <span className="form-error">{errors.termsAccepted}</span>}

        <div className="order-form-actions">
          {onClose && (
            <button type="button" className="btn btn-outline order-form-cancel" onClick={onClose}>
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="btn btn-yellow btn-lg order-form-submit"
            disabled={submitting || items.length === 0}
          >
            <Wand2 size={18} />
            {submitting ? 'A processar...' : 'Gerar submissão da encomenda'}
          </button>
        </div>
    </form>
  );
}
