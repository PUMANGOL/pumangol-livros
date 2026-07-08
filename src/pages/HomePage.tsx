import { useState, useMemo } from 'react';
import { BookOpen, Clock, MapPin, Package, Shield, ShoppingCart, Wallet } from 'lucide-react';
import { CatalogFilters } from '../components/catalog/CatalogFilters';
import { BookCard } from '../components/catalog/BookCard';
import { BookDetailModal } from '../components/catalog/BookDetailModal';
import { OrderSummaryPanel } from '../components/order/OrderSummaryPanel';
import { HeroTypewriter } from '../components/home/HeroTypewriter';
import { useOrderModal } from '../context/OrderModalContext';
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../hooks/useCategories';
import { useLevels } from '../hooks/useLevels';
import { useSchoolClasses } from '../hooks/useSchoolClasses';
import { useBooksPage } from '../hooks/useBooks';
import { useFindBooksPage } from '../hooks/useFindBooks';
import { mapApiBookToBook } from '../api/books';
import { Pagination } from '../components/ui/Pagination';
import { BookCardSkeleton } from '../components/catalog/BookCardSkeleton';
import type { BookFindParams } from '../types/api';
import type { Book } from '../types';
import './HomePage.css';

const heroFeatures = [
  { icon: BookOpen, label: 'Catálogo completo' },
  { icon: MapPin, label: 'Levantamento fácil' },
  { icon: Shield, label: 'Compra segura' },
];

const sobreItems = [
  {
    icon: Clock,
    title: 'Levantamento rápido',
    description: 'Levantamento em até 48h após a encomenda.',
  },
  {
    icon: MapPin,
    title: 'Pagamento no posto',
    description: 'Pagamento efectuado no posto seleccionado para recolha.',
  },
  {
    icon: Wallet,
    title: 'Formas de pagamento',
    description: 'Cash ou Multicaixa.',
  },
  {
    icon: Package,
    title: 'Stock limitado',
    description: 'Campanha válida enquanto durar o stock disponível.',
  },
];

const defaultBookFilters: BookFindParams = {
  schoolClassId: 0,
  categoryId: 0,
  educationLevelId: 0,
};

export function HomePage() {
  const { openOrderModal } = useOrderModal();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [grade, setGrade] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [bookFilters, setBookFilters] = useState<BookFindParams>(defaultBookFilters);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [page, setPage] = useState(0);

  const { data: categories = [], isLoading } = useCategories();
  const { data: levels = [], isLoading: isLevelsLoading } = useLevels();

  const educationLevelId = educationLevel ? Number(educationLevel) : 0;
  const {
    data: schoolClasses = [],
    isLoading: isSchoolClassesLoading,
  } = useSchoolClasses(educationLevelId);

  const {
    data: allBooksPage,
    isLoading: isAllBooksLoading,
    isFetching: isAllBooksFetching,
  } = useBooksPage(page);

  const {
    data: filteredBooksPage,
    isLoading: isFindBooksLoading,
    isFetching: isFindBooksFetching,
  } = useFindBooksPage(bookFilters, page, hasFiltered);

  const booksPage = hasFiltered ? filteredBooksPage : allBooksPage;
  const apiBooks = booksPage?.content ?? [];
  const totalPages = booksPage?.totalPages ?? 1;
  const totalElements = booksPage?.totalElements ?? 0;
  const isBooksLoading = hasFiltered ? isFindBooksLoading : isAllBooksLoading;
  const isBooksFetching = hasFiltered ? isFindBooksFetching : isAllBooksFetching;

  const books = useMemo(() => {
    if (!Array.isArray(apiBooks)) return [];
    return apiBooks.map(mapApiBookToBook);
  }, [apiBooks]);

  const filteredBooks = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return books;

    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.includes(query),
    );
  }, [books, search]);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setGrade('');
  };

  const handleEducationLevelChange = (value: string) => {
    setEducationLevel(value);
    setGrade('');
  };

  const handleFilter = () => {
    setBookFilters({
      schoolClassId: grade ? Number(grade) : 0,
      categoryId: category ? Number(category) : 0,
      educationLevelId: educationLevel ? Number(educationLevel) : 0,
    });
    setHasFiltered(true);
    setPage(0);
  };

  const handleClear = () => {
    setSearch('');
    setCategory('');
    setGrade('');
    setEducationLevel('');
    setBookFilters(defaultBookFilters);
    setHasFiltered(false);
    setPage(0);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    scrollTo('#catalogo');
  };

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="hero-badge">CAMPANHA ESCOLAR 2026</span>
            <HeroTypewriter />
            <p className="hero-subtitle">
              Prepare o novo ano letivo com os melhores livros escolares
            </p>

            <div className="hero-cta">
              <button type="button" className="btn btn-primary btn-lg" onClick={() => scrollTo('#catalogo')}>
                <BookOpen size={18} />
                Ver Catálogo
              </button>
              {isAuthenticated && (
                <button type="button" className="btn btn-yellow btn-lg" onClick={openOrderModal}>
                  <ShoppingCart size={18} />
                  Encomendar agora
                </button>
              )}
            </div>

            <div className="hero-features">
              {heroFeatures.map((f) => (
                <div key={f.label} className="hero-feature">
                  <f.icon size={16} />
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-book-wrap">
              <img
                src="/book.png"
                alt="Livro aberto com ícones de material escolar"
                className="hero-book"
              />
            </div>
            <div className="hero-logos">
              <img
                src="/super7.png"
                alt="Super 7"
                className="hero-super7"
              />
              <img
                src="/clube.png"
                alt="Clube do Livro — A paixão pelo conhecimento"
                className="hero-clube"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="main-content">
        <div className="container">
          <section id="sobre" className="sobre-section">
            <div className="sobre-section-header">
              <h2 className="section-title">Sobre</h2>
              <p className="section-subtitle">
                Condições simples e transparentes para o regresso às aulas.
              </p>
            </div>
            <div className="sobre-grid">
              {sobreItems.map((item) => (
                <div key={item.title} className="sobre-card">
                  <div className="sobre-icon">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="container main-grid">
          <div className="main-left">
            {/* Catalog */}
            <div id="catalogo" className="catalog-section">
              <div className="catalog-section-header">
                <h2 className="section-title">Catálogo de Livros</h2>
              </div>

              <CatalogFilters
                search={search}
                onSearchChange={setSearch}
                category={category}
                onCategoryChange={handleCategoryChange}
                grade={grade}
                onGradeChange={setGrade}
                educationLevel={educationLevel}
                onEducationLevelChange={handleEducationLevelChange}
                resultCount={search.trim() ? filteredBooks.length : totalElements}
                categories={categories}
                categoriesLoading={isLoading}
                levels={levels}
                levelsLoading={isLevelsLoading}
                schoolClasses={schoolClasses}
                schoolClassesLoading={isSchoolClassesLoading}
                onFilter={handleFilter}
                onClear={handleClear}
                filterLoading={isBooksLoading || isBooksFetching}
              />

              {isBooksLoading ? (
                <div className="catalog-grid">
                  <BookCardSkeleton count={8} />
                </div>
              ) : filteredBooks.length > 0 ? (
                <>
                  <div className="catalog-grid">
                    {filteredBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onSelect={setSelectedBook}
                      />
                    ))}
                  </div>
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    disabled={isBooksLoading || isBooksFetching}
                  />
                </>
              ) : (
                <div className="catalog-empty">
                  <span>📚</span>
                  <p>Nenhum livro encontrado. Ajuste os filtros.</p>
                </div>
              )}
            </div>
          </div>

          <div className="main-right">
            <OrderSummaryPanel />
          </div>
        </div>
      </section>

      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
