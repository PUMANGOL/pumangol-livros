import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogIn, LogOut, Menu, ShoppingBag, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Header.css';

const navLinks: { href: string; label: string }[] = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#catalogo', label: 'Catálogo' },
  { href: '#contatos', label: 'Contatos' },
];

export function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isBackoffice = pathname.startsWith('/backoffice');
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout, canAccessBackoffice } = useAuth();
  const { showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setUserMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [userMenuOpen]);

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

  const handleLogout = () => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    logout();
    showToast('Sessão terminada.');
    navigate('/');
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
          {!isBackoffice && (
            isAuthenticated ? (
              <a
                href="#resumo"
                className="header-icon-btn header-cart"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('#resumo');
                }}
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && <span className="header-cart-badge">{itemCount}</span>}
              </a>
            ) : (
              <>
                <Link
                  to="/cadastro"
                  className="btn btn-outline btn-sm header-signup"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="header-signup-text">Criar conta</span>
                </Link>
                <Link
                  to="/login"
                  className="btn btn-primary btn-sm header-login"
                  onClick={() => setMenuOpen(false)}
                >
                  <LogIn size={16} />
                  <span className="header-login-text">Entrar</span>
                </Link>
              </>
            )
          )}

          {isAuthenticated && user && (
            <div className="header-user-menu" ref={userMenuRef}>
              <button
                type="button"
                className={`header-icon-btn header-user-trigger${userMenuOpen ? ' header-icon-btn--active' : ''}`}
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                aria-label="Menu do utilizador"
              >
                <User size={20} />
              </button>

              {userMenuOpen && (
                <div className="header-user-dropdown" role="menu">
                  <div className="header-user-dropdown-info">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <div className="header-user-dropdown-divider" role="separator" />
                  {canAccessBackoffice && (
                    <Link
                      to="/backoffice"
                      className="header-user-dropdown-item"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      Painel Admin
                    </Link>
                  )}
                  {canAccessBackoffice && (
                    <div className="header-user-dropdown-divider" role="separator" />
                  )}
                  <button
                    type="button"
                    className="header-user-dropdown-logout"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Terminar sessão
                  </button>
                </div>
              )}
            </div>
          )}

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
