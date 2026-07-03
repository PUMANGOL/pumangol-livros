import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useBooksPage } from '../../hooks/useBooks';
import { useDeleteBook } from '../../hooks/useDeleteBook';
import { formatPrice } from '../../utils/helpers';
import { formatBookEducationLevels, formatBookGradeNames } from '../../utils/bookGrades';
import { BookCover } from '../../components/catalog/BookCover';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { Pagination } from '../../components/ui/Pagination';
import { useToast } from '../../context/ToastContext';
import type { ApiBook } from '../../types/api';

export function BackofficeBooksPage() {
  const [page, setPage] = useState(0);
  const { data: booksPage, isLoading, isFetching } = useBooksPage(page);
  const books = booksPage?.content ?? [];
  const totalPages = booksPage?.totalPages ?? 1;
  const totalElements = booksPage?.totalElements ?? 0;
  const { mutate: deleteBook, isPending: isDeleting, variables: deletingId } = useDeleteBook();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [bookToDelete, setBookToDelete] = useState<ApiBook | null>(null);

  const filteredBooks = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return books;

    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.includes(query) ||
        book.category.toLowerCase().includes(query),
    );
  }, [books, search]);

  const handleDeleteClick = (book: ApiBook) => {
    setBookToDelete(book);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setBookToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!bookToDelete) return;

    deleteBook(bookToDelete.id, {
      onSuccess: () => {
        showToast('Livro eliminado com sucesso.');
        setBookToDelete(null);
      },
      onError: () => {
        showToast('Não foi possível eliminar o livro.', 'error');
      },
    });
  };

  return (
    <div className="backoffice-page">
      <div className="backoffice-header">
        <div className="backoffice-header-inner">
          <div className="backoffice-header-row">
            <div>
              <h1 className="section-title">Livros</h1>
              <p className="section-subtitle">
                Catálogo de livros disponíveis na campanha escolar.
              </p>
            </div>
            <Link
              to="/backoffice/livros/novo"
              className="btn btn-primary"
            >
              <Plus size={18} />
              Adicionar livro
            </Link>
          </div>
        </div>
      </div>

      <div className="backoffice-body">
        {isLoading ? (
          <div className="backoffice-empty">
            <p>A carregar livros...</p>
          </div>
        ) : (
          <>
            <div className="backoffice-stats">
              <div className="stat-card">
                <span className="stat-value">{totalElements}</span>
                <span className="stat-label">Total Livros</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">
                  {books.filter((book) => book.available).length}
                </span>
                <span className="stat-label">Disponíveis (página)</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">
                  {books.filter((book) => !book.available).length}
                </span>
                <span className="stat-label">Indisponíveis (página)</span>
              </div>
            </div>

            <div className="backoffice-filters">
              <div className="backoffice-search">
                <Search size={18} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Pesquisar por título, autor, ISBN ou categoria..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {filteredBooks.length > 0 ? (
              <>
                <div className="backoffice-table-wrap">
                  <table className="backoffice-table backoffice-table--books">
                    <thead>
                      <tr>
                        <th>Capa</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Categoria</th>
                        <th>Classe</th>
                        <th>Preço</th>
                        <th>Estado</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks.map((book) => (
                        <tr key={book.id}>
                          <td>
                            <BookCover
                              title={book.title}
                              src={book.coverImage}
                              className="backoffice-book-thumb"
                            />
                          </td>
                          <td>
                            <div className="backoffice-book-title">{book.title}</div>
                            <div className="backoffice-book-isbn">{book.isbn}</div>
                          </td>
                          <td>{book.author}</td>
                          <td>{book.category}</td>
                          <td>
                            <div>{formatBookGradeNames(book.grades)}</div>
                            <div className="backoffice-book-meta">
                              {formatBookEducationLevels(book.grades)}
                            </div>
                          </td>
                          <td className="price">{formatPrice(book.price)}</td>
                          <td>
                            <span
                              className={`badge ${book.available ? 'badge-green' : 'badge-gray'}`}
                            >
                              {book.available ? 'Disponível' : 'Indisponível'}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="backoffice-book-delete"
                              onClick={() => handleDeleteClick(book)}
                              disabled={isDeleting && deletingId === book.id}
                              aria-label={`Eliminar ${book.title}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  disabled={isLoading || isFetching}
                />
              </>
            ) : (
              <div className="backoffice-empty">
                <p>
                  {books.length === 0 && totalElements === 0
                    ? 'Ainda não existem livros cadastrados.'
                    : 'Nenhum livro corresponde à pesquisa.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={bookToDelete !== null}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Eliminar livro"
        message={
          bookToDelete
            ? `Tem a certeza que deseja eliminar "${bookToDelete.title}"? Esta ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Eliminar"
        variant="danger"
        isPending={isDeleting}
      />
    </div>
  );
}
