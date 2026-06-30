import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useOrderModal } from '../../context/OrderModalContext';
import './Header.css';

const navLinks: { href: string; label: string }[] = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#catalogo', label: 'Catálogo' },
  { href: '#contatos', label: 'Contatos' },
];

export function Header() {
  const { itemCount } = useCart();
  const { openOrderModal } = useOrderModal();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollTo(href);
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="header-logo" onClick={() => setMenuOpen(false)}>
          <img src="/logo-pumangol.svg" alt="Pumangol — Cria boa energia" height={10} width={100} />
        </Link>

        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="header-nav-link"
              onClick={handleNavClick(link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a
            href="#encomenda"
            className="btn btn-primary btn-sm header-finalize"
            onClick={(e) => {
              e.preventDefault();
              openOrderModal();
            }}
          >
            <ShoppingCart size={16} />
            <span className="header-finalize-text">Finalizar pedido</span>
          </a>

          <a
            href="#resumo"
            className="header-cart"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#resumo');
            }}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && <span className="header-cart-badge">{itemCount}</span>}
          </a>

          <button
            className="header-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
