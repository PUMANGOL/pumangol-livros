import { Link, useLocation, useParams } from 'react-router-dom';
import { CheckCircle, Mail, MessageCircle, MapPin, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, formatDate } from '../utils/helpers';
import type { Order } from '../types';
import './ConfirmationPage.css';

export function ConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const { orders } = useCart();

  const order: Order | undefined =
    (location.state as { order?: Order })?.order ||
    orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="confirmation-page">
        <div className="container confirmation-empty">
          <h2>Encomenda não encontrada</h2>
          <Link to="/" className="btn btn-primary">Voltar ao Início</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-card animate-fade-in-up">
          <div className="confirmation-icon">
            <CheckCircle size={64} />
          </div>

          <h1>Encomenda Confirmada!</h1>
          <p className="confirmation-subtitle">
            O seu pedido foi recebido com sucesso. Referência: <strong>{order.id}</strong>
          </p>

          <div className="confirmation-notifications">
            <div className="notification-badge">
              <Mail size={20} />
              <div>
                <strong>Email enviado</strong>
                <span>Resumo enviado para {order.customer.email}</span>
              </div>
            </div>
            <div className="notification-badge">
              <MessageCircle size={20} />
              <div>
                <strong>WhatsApp enviado</strong>
                <span>Confirmação enviada para {order.customer.phone}</span>
              </div>
            </div>
          </div>

          <div className="confirmation-details">
            <div className="confirmation-detail">
              <MapPin size={18} />
              <div>
                <span className="detail-label">Posto de levantamento</span>
                <span className="detail-value">
                  {order.customer.pickupPostName ?? order.customer.pickupPostId}
                </span>
              </div>
            </div>
            <div className="confirmation-detail">
              <span className="detail-label">Data do pedido</span>
              <span className="detail-value">{formatDate(order.createdAt)}</span>
            </div>
          </div>

          <div className="confirmation-items">
            <h3>Livros encomendados</h3>
            <ul>
              {order.items.map(({ book, quantity }) => (
                <li key={book.id}>
                  <span>{book.title}</span>
                  <span>x{quantity}</span>
                  <span>{formatPrice(book.price * quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="confirmation-total">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="confirmation-actions">
            <Link to="/catalogo" className="btn btn-secondary">
              Continuar a Comprar
            </Link>
            <Link to="/" className="btn btn-primary">
              Voltar ao Início
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
