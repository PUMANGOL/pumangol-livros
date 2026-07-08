import { BrushCleaning, Search, SlidersHorizontal } from 'lucide-react';
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
  onClear: () => void;
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
  onClear,
  filterLoading = false,
}: CatalogFiltersProps) {
  const hasActiveFilters = !!(search.trim() || category || educationLevel || grade);

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
        <div className="catalog-filters-heading">
          <SlidersHorizontal size={14} />
          <span>Filtros</span>
        </div>

        <div className="catalog-filters-selects">
          <div className="catalog-filters-field">
            <span className="catalog-filters-field-label">Categoria</span>
            <Select
              value={category}
              onChange={onCategoryChange}
              disabled={categoriesLoading}
              placeholder={categoriesLoading ? 'A carregar...' : 'Todas'}
              options={categories?.map((c) => ({ value: String(c.id), label: c.name })) || []}
            />
          </div>

          <div className="catalog-filters-field">
            <span className="catalog-filters-field-label">Nível de ensino</span>
            <Select
              value={educationLevel}
              onChange={onEducationLevelChange}
              disabled={levelsLoading}
              placeholder={levelsLoading ? 'A carregar...' : 'Todos'}
              options={levels?.map((l) => ({ value: String(l.id), label: l.name })) || []}
            />
          </div>

          <div className="catalog-filters-field">
            <span className="catalog-filters-field-label">Classe</span>
            <Select
              value={grade}
              onChange={onGradeChange}
              disabled={schoolClassesLoading}
              placeholder={schoolClassesLoading ? 'A carregar...' : 'Todas'}
              options={schoolClasses?.map((c) => ({ value: String(c.id), label: c.name })) || []}
            />
          </div>
        </div>

        <div className="catalog-filters-actions">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onFilter}
            disabled={filterLoading}
          >
            {filterLoading ? 'A filtrar...' : 'Filtrar'}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-primary btn-sm catalog-filters-clear"
              onClick={onClear}
              title="Limpar filtros"
              aria-label="Limpar filtros"
            >
              <BrushCleaning size={18} />
            </button>
          )}
        </div>

        <span className="catalog-filters-count">
          {resultCount} {resultCount === 1 ? 'livro' : 'livros'}
        </span>
      </div>
    </div>
  );
}
