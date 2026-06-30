import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, MapPin, Bell, Truck } from 'lucide-react';
import { CategoryCards } from '../components/catalog/CategoryCards';
import { BookCard } from '../components/catalog/BookCard';
import { books } from '../data/books';
import './LandingPage.css';

const featuredBooks = books.slice(0, 4);

const features = [
  {
    icon: BookOpen,
    title: 'Catálogo Completo',
    description: 'Livros organizados por categorias, classes e níveis de ensino.',
  },
  {
    icon: MapPin,
    title: 'Postos em Todo o País',
    description: 'Levante a sua encomenda no posto Pumangol mais próximo.',
  },
  {
    icon: Bell,
    title: 'Notificações Automáticas',
    description: 'Confirmação imediata por Email e WhatsApp.',
  },
  {
    icon: Truck,
    title: 'Processo Simplificado',
    description: 'Encomende em minutos, sem complicações.',
  },
];

export function LandingPage() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80"
            alt="Crianças angolanas numa sala de aula"
            className="hero-bg-image"
          />
          <div className="hero-overlay" />
        </div>

        <div className="container hero-content">
          <div className="hero-badge animate-fade-in-up">
            <span>🎒</span> Campanha 2026
          </div>

          <img
            src="/logo-pumangol.svg"
            alt="Pumangol"
            className="hero-logo animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          />

          <h1 className="hero-title animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Bom Regresso às Aulas
          </h1>

          <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Prepare o novo ano letivo com os melhores livros escolares
          </p>

          <div className="hero-cta animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/catalogo" className="btn btn-primary btn-lg">
              Ver Catálogo
              <ArrowRight size={20} />
            </Link>
            <Link to="/encomenda" className="btn btn-secondary btn-lg">
              Encomendar Agora
            </Link>
          </div>

          <div className="hero-decor">
            <span className="decor-star" style={{ top: '10%', left: '5%' }}>⭐</span>
            <span className="decor-star" style={{ top: '20%', right: '8%' }}>📚</span>
            <span className="decor-star" style={{ bottom: '15%', left: '10%' }}>✏️</span>
            <span className="decor-star" style={{ bottom: '25%', right: '5%' }}>🎒</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">
                  <f.icon size={24} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Categorias em Destaque</h2>
            <p className="section-subtitle">
              Encontre rapidamente os livros certos para cada disciplina e nível de ensino.
            </p>
          </div>
          <CategoryCards />
        </div>
      </section>

      {/* Featured Books */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header section-header-row">
            <div>
              <h2 className="section-title">Livros Populares</h2>
              <p className="section-subtitle">
                Os manuais mais procurados para o regresso às aulas.
              </p>
            </div>
            <Link to="/catalogo" className="btn btn-ghost">
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>

          <div className="books-grid">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-banner-inner">
            <div className="cta-banner-content">
              <h2>Escolha os seus livros e faça já a sua encomenda</h2>
              <p>
                Processo simples, rápido e com levantamento nos postos Pumangol em todo o território nacional.
              </p>
              <Link to="/encomenda" className="btn btn-primary btn-lg">
                Começar Encomenda
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="cta-banner-visual">
              <img
                src="https://images.unsplash.com/photo-1497633768975-a4d542786e0c?w=600&q=80"
                alt="Livros escolares e material escolar"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
