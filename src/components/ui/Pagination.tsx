import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const canGoPrev = page > 0;
  const canGoNext = page < totalPages - 1;

  return (
    <nav className="pagination" aria-label="Paginação">
      <button
        type="button"
        className="pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || !canGoPrev}
        aria-label="Página anterior"
      >
        <ChevronLeft size={18} />
      </button>

      <span className="pagination-info">
        Página {page + 1} de {totalPages}
      </span>

      <button
        type="button"
        className="pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || !canGoNext}
        aria-label="Página seguinte"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
