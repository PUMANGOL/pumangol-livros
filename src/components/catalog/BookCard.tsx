import type { KeyboardEvent, MouseEvent } from 'react';
import { ShoppingCart } from 'lucide-react';
import type { Book } from '../../types';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { BookCover } from './BookCover';
import './BookCard.css';

interface BookCardProps {
  book: Book;
  onSelect?: (book: Book) => void;
}

export function BookCard({ book, onSelect }: BookCardProps) {
  const { addToCart } = useCart();

  const handleCardClick = () => {
    onSelect?.(book);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onSelect) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(book);
    }
  };

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    addToCart(book);
  };

  return (
    <article
      className={`book-card${onSelect ? ' book-card--interactive' : ''}`}
      onClick={onSelect ? handleCardClick : undefined}
      onKeyDown={onSelect ? handleCardKeyDown : undefined}
      tabIndex={onSelect ? 0 : undefined}
      role={onSelect ? 'button' : undefined}
      aria-label={onSelect ? `Ver detalhes de ${book.title}` : undefined}
    >
      <div className="book-card-cover">
        <BookCover
          title={book.title}
          src={book.coverImage}
          className="book-card-cover-inner"
        />
      </div>

      <div className="book-card-body">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-meta">{book.category}</p>
        <div className="book-card-footer">
          <span className="book-card-price">{formatPrice(book.price)}</span>
          <button
            type="button"
            className="btn btn-yellow btn-sm book-card-btn"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={14} />
            <span className="book-card-btn-label">Adicionar</span>
          </button>
        </div>
      </div>
    </article>
  );
}
