import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import './CategoryCards.css';

export function CategoryCards() {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return <p className="category-grid-loading">A carregar categorias...</p>;
  }

  return (
    <div className="category-grid">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          to="/#catalogo"
          className="category-card"
          style={{ '--cat-color': cat.color } as CSSProperties}
        >
          <span className="category-card-icon">{cat.icon}</span>
          <h3 className="category-card-name">{cat.name}</h3>
          <p className="category-card-desc">{cat.description}</p>
        </Link>
      ))}
    </div>
  );
}
