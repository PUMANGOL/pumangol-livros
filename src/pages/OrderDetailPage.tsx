import { useParams, Link, Navigate, useLocation } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  Package,
  ShoppingBag,
  MapPin,
  User,
  Mail,
  Phone,
  XCircle,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { useOrder } from '../hooks/useOrder';
import { useAuth } from '../context/AuthContext';
import { getOrderTotal } from '../api/orders';
import { formatPrice, formatDate } from '../utils/helpers';
import { BookCover } from '../components/catalog/BookCover';
import './OrderDetailPage.css';

interface StepperStep {
  key: string;
  label: string;
  icon: React.ElementType;
}

const STEPPER_STEPS: StepperStep[] = [
  { key: 'PENDING', label: 'Pedido Recebido', icon: ShoppingBag },
  { key: 'ACTIVATED', label: 'Em Processamento', icon: Clock },
  { key: 'READY_FOR_PICKUP', label: 'Pronto para Entrega', icon: Package },
  { key: 'DELIVERED', label: 'Entregue', icon: CheckCircle },
];

const STATUS_STEP_INDEX: Record<string, number> = {
  Pendente: 0,
  'Em Processamento': 1,
  'Pronto para Entrega': 2,
  Entregue: 3,
};

function isCancelledStatus(status: string) {
  return status === 'Cancelado';
}

export function OrderDetailPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const { user, isAuthenticated, isLoading: authLoading, canAccessBackoffice } = useAuth();
  const { data: order, isLoading: orderLoading, isError } = useOrder(
    isAuthenticated ? orderId : undefined,
  );

  // 1. Wait for auth to resolve before doing anything
  if (authLoading) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="order-detail-loading">
            <div className="order-loading-spinner" />
            <p>A verificar sessão...</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Not logged in → send to login, preserve the current URL to return after
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Fetching order
  if (orderLoading) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="order-detail-loading">
            <div className="order-loading-spinner" />
            <p>A carregar encomenda...</p>
          </div>
        </div>
      </div>
    );
  }

  // 4. API error or not found
  if (isError || !order) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="order-detail-empty">
            <AlertCircle size={52} />
            <h2>Encomenda não encontrada</h2>
            <p>Não foi possível encontrar a encomenda <strong>#{orderId}</strong>.</p>
            <Link to="/" className="btn btn-primary">Voltar ao Início</Link>
          </div>
        </div>
      </div>
    );
  }

  // 5. Ownership check — admins can see any order; regular users only their own
  const isOwner =
    canAccessBackoffice ||
    order.customer.email === user?.email ||
    order.customer.phone === user?.msisdn;

  if (!isOwner) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="order-detail-empty">
            <Lock size={52} />
            <h2>Acesso não autorizado</h2>
            <p>Não tem permissão para visualizar esta encomenda.</p>
            <Link to="/" className="btn btn-primary">Voltar ao Início</Link>
          </div>
        </div>
      </div>
    );
  }

  const cancelled = isCancelledStatus(order.status);
  const currentStep = cancelled ? -1 : (STATUS_STEP_INDEX[order.status] ?? 0);
  const total = getOrderTotal(order);
  const displayLabel = order.status;

  return (
    <div className="order-detail-page">
      <div className="container">
        <div className="order-detail-card animate-fade-in-up">

          {/* ── Header ── */}
          <div className="order-detail-header">
            <div className="order-detail-title">
              <h1>
                Encomenda <span className="order-id">#{order.id}</span>
              </h1>
              <p className="order-detail-date">
                <Calendar size={14} />
                Realizada em {formatDate(order.createAt)}
              </p>
            </div>
            <span className={`order-status-badge ${cancelled ? 'status-cancelled' : 'status-active'}`}>
              {displayLabel}
            </span>
          </div>

          {/* ── Stepper ── */}
          {cancelled ? (
            <div className="order-cancelled-banner">
              <XCircle size={28} />
              <div>
                <strong>Encomenda Cancelada</strong>
                <p>Esta encomenda foi cancelada e não será processada.</p>
              </div>
            </div>
          ) : (
            <div className="order-stepper">
              {STEPPER_STEPS.map((step, index) => {
                const completed = index < currentStep;
                const active = index === currentStep;
                const isLast = index === STEPPER_STEPS.length - 1;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="stepper-item">
                    <div className="stepper-node-wrap">
                      <div
                        className={[
                          'stepper-node',
                          completed ? 'stepper-node--completed' : '',
                          active ? 'stepper-node--active' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {completed ? <CheckCircle size={22} /> : <Icon size={22} />}
                      </div>
                      <span
                        className={[
                          'stepper-label',
                          completed ? 'stepper-label--completed' : '',
                          active ? 'stepper-label--active' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {step.label}
                      </span>
                    </div>

                    {!isLast && (
                      <div
                        className={[
                          'stepper-connector',
                          completed ? 'stepper-connector--completed' : '',
                          active ? 'stepper-connector--active' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {active && <div className="stepper-connector-bar" />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Details grid ── */}
          <div className="order-detail-grid">
            <div className="order-detail-section">
              <h3 className="section-heading">
                <User size={16} />
                Dados do Cliente
              </h3>
              <ul className="order-info-list">
                <li className="order-info-item">
                  <span className="info-label">Nome</span>
                  <span className="info-value">{order.customer.fullName}</span>
                </li>
                <li className="order-info-item">
                  <span className="info-label">
                    <Phone size={12} /> Telefone
                  </span>
                  <span className="info-value">{order.customer.phone}</span>
                </li>
                <li className="order-info-item">
                  <span className="info-label">
                    <Mail size={12} /> Email
                  </span>
                  <span className="info-value">{order.customer.email}</span>
                </li>
                <li className="order-info-item">
                  <span className="info-label">
                    <MapPin size={12} /> Localização
                  </span>
                  <span className="info-value">{order.customer.location}</span>
                </li>
              </ul>
            </div>

            <div className="order-detail-section">
              <h3 className="section-heading">
                <MapPin size={16} />
                Posto de Levantamento
              </h3>
              <div className="pickup-post-card">
                <div className="pickup-post-icon">
                  <MapPin size={28} />
                </div>
                <div className="pickup-post-info">
                  <span className="pickup-post-name">{order.pickupPost}</span>
                  {order.notes && (
                    <span className="pickup-notes">{order.notes}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Items ── */}
          <div className="order-detail-items">
            <h3 className="section-heading">
              <Package size={16} />
              Livros Encomendados
            </h3>
            <ul className="items-list">
              {order.items.map((item) => (
                <li key={item.id} className="item-row">
                  <BookCover
                    title={item.book}
                    src={item.coverImage}
                    className="item-cover"
                  />
                  <span className="item-name">{item.book}</span>
                  <span className="item-qty">× {item.quantity}</span>
                  <span className="item-price">{formatPrice(item.subTotal ?? item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="order-detail-total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="order-detail-actions">
            <Link to="/" className="btn btn-secondary">
              <ArrowLeft size={16} />
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
