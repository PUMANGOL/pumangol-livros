import { useMemo, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useDeleteCategory } from '../../hooks/useDeleteCategory';
import { AddCategoryModal } from '../../components/backoffice/AddCategoryModal';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import type { Category } from '../../types/api';

export function BackofficeCategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const { mutate: deleteCategory, isPending: isDeleting, variables: deletingId } = useDeleteCategory();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const filteredCategories = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return categories;

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query),
    );
  }, [categories, search]);

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;

    deleteCategory(categoryToDelete.id, {
      onSuccess: () => {
        showToast('Categoria eliminada com sucesso.');
        setCategoryToDelete(null);
      },
      onError: () => {
        showToast('Não foi possível eliminar a categoria.', 'error');
      },
    });
  };

  return (
    <div className="backoffice-page">
      <div className="backoffice-header">
        <div className="backoffice-header-inner">
          <div className="backoffice-header-row">
            <div>
              <h1 className="section-title">Categorias</h1>
              <p className="section-subtitle">
                Gerir as categorias do catálogo de livros.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsAddCategoryOpen(true)}
            >
              <Plus size={18} />
              Adicionar categoria
            </button>
          </div>
        </div>
      </div>

      <div className="backoffice-body">
        {isLoading ? (
          <div className="backoffice-empty">
            <p>A carregar categorias...</p>
          </div>
        ) : (
          <>
            <div className="backoffice-stats">
              <div className="stat-card">
                <span className="stat-value">{categories.length}</span>
                <span className="stat-label">Total Categorias</span>
              </div>
            </div>

            <div className="backoffice-filters">
              <div className="backoffice-search">
                <Search size={18} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Pesquisar por nome, slug ou descrição..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {filteredCategories.length > 0 ? (
              <div className="backoffice-table-wrap">
                <table className="backoffice-table backoffice-table--categories">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Slug</th>
                      <th>Cor</th>
                      <th>Descrição</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => (
                      <tr key={category.id}>
                        <td>
                          <div className="backoffice-book-title">{category.name}</div>
                        </td>
                        <td className="mono">{category.slug}</td>
                        <td>
                          {category.color ? (
                            <span className="backoffice-category-color">
                              <span
                                className="backoffice-category-color-swatch"
                                style={{ backgroundColor: category.color }}
                                aria-hidden="true"
                              />
                              <span>{category.color}</span>
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td>{category.description}</td>
                        <td>
                          <button
                            type="button"
                            className="backoffice-book-delete"
                            onClick={() => handleDeleteClick(category)}
                            disabled={isDeleting && deletingId === category.id}
                            aria-label={`Eliminar ${category.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="backoffice-empty">
                <p>
                  {categories.length === 0
                    ? 'Ainda não existem categorias cadastradas.'
                    : 'Nenhuma categoria corresponde à pesquisa.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
      />

      <ConfirmModal
        isOpen={categoryToDelete !== null}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Eliminar categoria"
        message={
          categoryToDelete
            ? `Tem a certeza que deseja eliminar "${categoryToDelete.name}"? Esta ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Eliminar"
        variant="danger"
        isPending={isDeleting}
      />
    </div>
  );
}
