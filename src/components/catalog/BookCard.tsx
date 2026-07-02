import { ShoppingCart } from 'lucide-react';
import type { Book } from '../../types';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { BookCover } from './BookCover';
import './BookCard.css';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart();

  return (
    <article className="book-card">

      <div className="book-card-cover">
        <BookCover
          title={book.title}
          src={book.coverImage}
          className="book-card-cover-inner"
        />
      </div>

      <div className="book-card-body">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-meta">{book.grade} · {book.educationLevel}</p>
        <div className="book-card-footer">
          <span className="book-card-price">{formatPrice(book.price)}</span>
          <button
            type="button"
            className="btn btn-yellow btn-sm book-card-btn"
            onClick={() => addToCart(book)}
          >
            <ShoppingCart size={14} />
            <span className="book-card-btn-label">Adicionar</span>
          </button>
        </div>
      </div>
    </article>
  );
}
