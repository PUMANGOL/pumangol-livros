import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, LogIn, MapPin, Package, Shield, ShoppingCart, UserPlus, Wallet } from 'lucide-react';
import { CatalogFilters } from '../components/catalog/CatalogFilters';
import { BookCard } from '../components/catalog/BookCard';
import { OrderSummaryPanel } from '../components/order/OrderSummaryPanel';
import { HeroTypewriter } from '../components/home/HeroTypewriter';
import { useOrderModal } from '../context/OrderModalContext';
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../hooks/useCategories';
import { useLevels } from '../hooks/useLevels';
import { useSchoolClasses } from '../hooks/useSchoolClasses';
import { useBooks } from '../hooks/useBooks';
import { useFindBooks } from '../hooks/useFindBooks';
import { mapApiBookToBook } from '../api/books';
import type { BookFindParams } from '../types/api';
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

  const { data: categories = [], isLoading } = useCategories();
  const { data: levels = [], isLoading: isLevelsLoading } = useLevels();

  const educationLevelId = educationLevel ? Number(educationLevel) : 0;
  const {
    data: schoolClasses = [],
    isLoading: isSchoolClassesLoading,
  } = useSchoolClasses(educationLevelId);

  const {
    data: allApiBooks = [],
    isLoading: isAllBooksLoading,
  } = useBooks();

  const {
    data: filteredApiBooks = [],
    isLoading: isFindBooksLoading,
    isFetching: isFindBooksFetching,
  } = useFindBooks(bookFilters, hasFiltered);

  const apiBooks = hasFiltered ? filteredApiBooks : allApiBooks;
  const isBooksLoading = hasFiltered ? isFindBooksLoading : isAllBooksLoading;
  const isBooksFetching = hasFiltered ? isFindBooksFetching : false;

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
              {isAuthenticated ? (
                <button type="button" className="btn btn-yellow btn-lg" onClick={openOrderModal}>
                  <ShoppingCart size={18} />
                  Encomendar agora
                </button>
              ) : (
                <>
                  <Link to="/cadastro" className="btn btn-yellow btn-lg">
                    <UserPlus size={18} />
                    Criar conta
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-lg hero-login-btn">
                    <LogIn size={18} />
                    Entrar
                  </Link>
                </>
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
                resultCount={filteredBooks.length}
                categories={categories}
                categoriesLoading={isLoading}
                levels={levels}
                levelsLoading={isLevelsLoading}
                schoolClasses={schoolClasses}
                schoolClassesLoading={isSchoolClassesLoading}
                onFilter={handleFilter}
                filterLoading={isBooksLoading || isBooksFetching}
              />

              {isBooksLoading ? (
                <div className="catalog-empty">
                  <span>📚</span>
                  <p>A carregar livros...</p>
                </div>
              ) : filteredBooks.length > 0 ? (
                <div className="catalog-grid">
                  {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
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
    </div>
  );
}
