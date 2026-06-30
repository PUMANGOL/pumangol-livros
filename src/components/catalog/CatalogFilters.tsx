import { Search, SlidersHorizontal } from 'lucide-react';
import { Select } from '../ui/Select';
import './CatalogFilters.css';

interface CategoryOption {
  id: number;
  name: string;
}

interface LevelOption {
  id: number;
  name: string;
}

interface SchoolClassOption {
  id: number;
  name: string;
}

interface CatalogFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  grade: string;
  onGradeChange: (value: string) => void;
  educationLevel: string;
  onEducationLevelChange: (value: string) => void;
  resultCount: number;
  categories?: CategoryOption[];
  levels?: LevelOption[];
  schoolClasses?: SchoolClassOption[];
  categoriesLoading?: boolean;
  levelsLoading?: boolean;
  schoolClassesLoading?: boolean;
  onFilter: () => void;
  filterLoading?: boolean;
}

export function CatalogFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  grade,
  onGradeChange,
  educationLevel,
  onEducationLevelChange,
  resultCount,
  categories,
  levels,
  schoolClasses,
  categoriesLoading = false,
  levelsLoading = false,
  schoolClassesLoading = false,
  onFilter,
  filterLoading = false,
}: CatalogFiltersProps) {
  return (
    <div className="catalog-filters">
      <div className="catalog-filters-search">
        <Search size={18} className="catalog-filters-search-icon" aria-hidden="true" />
        <input
          type="text"
          className="catalog-filters-search-input"
          placeholder="Pesquisar livro, autor, título..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="catalog-filters-row">
        <div className="catalog-filters-group">
          <SlidersHorizontal size={16} />
          <span className="catalog-filters-label">Filtros:</span>
        </div>

        <Select
          className="catalog-filters-select"
          value={category}
          onChange={onCategoryChange}
          disabled={categoriesLoading}
          placeholder={categoriesLoading ? 'A carregar categorias...' : 'Todas as categorias'}
          options={categories?.map((c) => ({ value: String(c.id), label: c.name })) || []}
        />

        <Select
          className="catalog-filters-select"
          value={educationLevel}
          onChange={onEducationLevelChange}
          disabled={levelsLoading}
          placeholder={levelsLoading ? 'A carregar níveis...' : 'Todos os níveis'}
          options={levels?.map((l) => ({ value: String(l.id), label: l.name })) || []}
        />

        <Select
          className="catalog-filters-select"
          value={grade}
          onChange={onGradeChange}
          disabled={schoolClassesLoading}
          placeholder={schoolClassesLoading ? 'A carregar classes...' : 'Todas as classes'}
          options={schoolClasses?.map((c) => ({ value: String(c.id), label: c.name })) || []}
        />

        <button
          type="button"
          className="btn btn-primary btn-sm catalog-filters-submit"
          onClick={onFilter}
          disabled={filterLoading}
        >
          {filterLoading ? 'A filtrar...' : 'Filtrar'}
        </button>

        <span className="catalog-filters-count">
          {resultCount} {resultCount === 1 ? 'livro' : 'livros'}
        </span>
      </div>
    </div>
  );
}
