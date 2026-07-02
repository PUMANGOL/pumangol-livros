import { useEffect, useState } from 'react';
import './BookCover.css';

interface BookCoverProps {
  title: string;
  src?: string | null;
  alt?: string;
  className?: string;
  imageClassName?: string;
}

function getBookTitleInitial(title: string): string {
  const trimmed = title.trim();
  return trimmed ? trimmed[0].toUpperCase() : '?';
}

export function BookCover({
  title,
  src,
  alt,
  className = '',
  imageClassName = '',
}: BookCoverProps) {
  const [hasError, setHasError] = useState(false);
  const showFallback = !src?.trim() || hasError;

  useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <div
      className={[
        'book-cover',
        showFallback && 'book-cover--fallback',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {!showFallback ? (
        <img
          src={src!.trim()}
          alt={alt ?? title}
          className={['book-cover__img', imageClassName].filter(Boolean).join(' ')}
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="book-cover-initial" aria-hidden="true">
          {getBookTitleInitial(title)}
        </span>
      )}
    </div>
  );
}
