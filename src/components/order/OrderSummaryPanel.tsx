import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrderModal } from '../../context/OrderModalContext';
import { formatPrice } from '../../utils/helpers';
import './OrderSummaryPanel.css';

export function OrderSummaryPanel() {
  const { items, updateQuantity, removeFromCart, total, itemCount } = useCart();
  const { openOrderModal } = useOrderModal();

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <aside id="resumo" className="panel order-summary">
      <div className="panel-header">
        <h2>Resumo da Encomenda</h2>
      </div>

      <div className="panel-body">
        {items.length === 0 ? (
          <p className="order-summary-empty">Ainda não adicionou livros ao pedido.</p>
        ) : (
          <ul className="order-summary-list">
            {items.map(({ book, quantity }) => (
              <li key={book.id} className="order-summary-item">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="order-summary-thumb"
                />
                <div className="order-summary-info">
                  <h4>{book.title}</h4>
                  <p>{book.grade} · {book.educationLevel}</p>
                  <span className="order-summary-price">{formatPrice(book.price)}</span>
                </div>
                <div className="order-summary-controls">
                  <div className="order-qty">
                    <button type="button" onClick={() => updateQuantity(book.id, quantity - 1)} aria-label="Diminuir">
                      <Minus size={12} />
                    </button>
                    <span>{quantity}</span>
                    <button type="button" onClick={() => updateQuantity(book.id, quantity + 1)} aria-label="Aumentar">
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="order-summary-remove"
                    onClick={() => removeFromCart(book.id)}
                    aria-label="Remover"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="order-summary-totals">
          <div className="order-summary-row">
            <span>Itens</span>
            <span>{itemCount}</span>
          </div>
          <div className="order-summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="order-summary-row">
            <span>Serviço</span>
            <span>0 Kz</span>
          </div>
          <div className="order-summary-row order-summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <div className="order-summary-actions">
          <button
            type="button"
            className="btn btn-outline btn-block"
            onClick={() => scrollTo('#catalogo')}
          >
            Continuar a escolher
          </button>
          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={items.length === 0}
            onClick={openOrderModal}
          >
            Avançar para encomenda
          </button>
        </div>
      </div>
    </aside>
  );
}
