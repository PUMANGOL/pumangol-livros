import { useMemo } from 'react';
import { MapPin, User } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { getOrderTotal } from '../../api/orders';
import { useBooksLookup } from '../../hooks/useBooks';
import { formatPrice, formatDate } from '../../utils/helpers';
import { formatBookGradeNames } from '../../utils/bookGrades';
import { BookCover } from '../catalog/BookCover';
import { orderStatusLabels, orderStatusColors } from '../../constants/orderStatus';
import type { ApiOrderDetail } from '../../types/api';
import './OrderItemsModal.css';

interface OrderItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ApiOrderDetail | null;
}

export function OrderItemsModal({ isOpen, onClose, order }: OrderItemsModalProps) {
  const { data: books = [] } = useBooksLookup();

  const bookById = useMemo(() => {
    const map = new Map(books.map((book) => [book.id, book]));
    return map;
  }, [books]);

  if (!order) return null;

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const total = getOrderTotal(order);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Encomenda #${order.id}`}
      maxWidth="640px"
    >
      <div className="order-items-modal">
        <div className="order-items-modal-meta">
          <div className="order-items-modal-meta-item">
            <User size={16} />
            <div>
              <span className="order-items-modal-label">Cliente</span>
              <span className="order-items-modal-value">{order.customer.fullName}</span>
              <span className="order-items-modal-subvalue">
                {order.customer.phone} · {order.customer.email}
              </span>
            </div>
          </div>
          <div className="order-items-modal-meta-item">
            <MapPin size={16} />
            <div>
              <span className="order-items-modal-label">Posto de levantamento</span>
              <span className="order-items-modal-value">{order.pickupPost}</span>
              <span className="order-items-modal-subvalue">{order.customer.location}</span>
            </div>
          </div>
        </div>

        <div className="order-items-modal-status-row">
          <span className={`badge ${orderStatusColors[order.status] ?? 'badge-blue'}`}>
            {orderStatusLabels[order.status] ?? order.status}
          </span>
          <span className="order-items-modal-date">{formatDate(order.createAt)}</span>
        </div>

        {order.notes?.trim() && (
          <div className="order-items-modal-notes">
            <span className="order-items-modal-label">Observações</span>
            <p>{order.notes}</p>
          </div>
        )}

        <div className="order-items-modal-section">
          <h3>Livros encomendados ({itemCount})</h3>
          <ul className="order-items-modal-list">
            {order.items.map((item) => {
              const book = bookById.get(item.bookId);

              return (
                <li key={item.id} className="order-items-modal-item">
                  <BookCover
                    title={book?.title ?? item.book}
                    src={item.coverImage ?? book?.coverImage}
                    className="order-items-modal-thumb"
                  />
                  <div className="order-items-modal-info">
                    <h4>{item.book}</h4>
                    {book && (
                      <p>
                        {formatBookGradeNames(book.grades)} · {book.category}
                      </p>
                    )}
                    <span className="order-items-modal-unit-price">
                      {formatPrice(item.price)} / un.
                    </span>
                  </div>
                  <div className="order-items-modal-qty">×{item.quantity}</div>
                  <div className="order-items-modal-subtotal">
                    {formatPrice(item.subTotal ?? item.price * item.quantity)}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="order-items-modal-total">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </Modal>
  );
}
