import { ShoppingCart } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { BookCover } from './BookCover';
import type { Book } from '../../types';
import { formatPrice, getBookCoverImageUrl } from '../../utils/helpers';
import { formatBookGradeNames } from '../../utils/bookGrades';
import { useCart } from '../../context/CartContext';
import './BookDetailModal.css';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
}

interface DetailRow {
  label: string;
  value: string;
}

function getDetailRows(book: Book): DetailRow[] {
  return [
    { label: 'Autor', value: book.author },
    { label: 'ISBN', value: book.isbn },
    { label: 'Categoria', value: book.category },
    { label: 'Classe', value: formatBookGradeNames(book.grades) },
  ];
}

export function BookDetailModal({ book, onClose }: BookDetailModalProps) {
  const { addToCart } = useCart();

  if (!book) return null;

  const coverSrc = getBookCoverImageUrl(book.coverImage, 400, 400);
  const detailRows = getDetailRows(book);

  const handleAddToCart = () => {
    addToCart(book);
    onClose();
  };

  return (
    <Modal
      isOpen={book !== null}
      onClose={onClose}
      title={book.title}
      maxWidth="800px"
      bodyClassName="modal-body--split"
    >
      <div className="book-detail-modal">
        <div className="book-detail-modal-content">
          <div className="book-detail-modal-cover">
            <BookCover
              title={book.title}
              src={coverSrc ?? book.coverImage}
              className="book-detail-modal-cover-inner"
            />
          </div>

          <div className="book-detail-modal-info">
            <p className="book-detail-modal-price">{formatPrice(book.price)}</p>

            <dl className="book-detail-modal-details">
              {detailRows.map((row) => (
                <div key={row.label} className="book-detail-modal-detail">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>

            {book.description?.trim() && (
              <div className="book-detail-modal-description">
                <h3>Descrição</h3>
                <p>{book.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="book-detail-modal-footer">
          <button
            type="button"
            className="btn btn-yellow book-detail-modal-add"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </Modal>
  );
}
