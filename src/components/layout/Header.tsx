import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogIn, LogOut, Menu, ShoppingBag, User, UserPlus, X } from 'lucide-react';
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

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
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
          {/* Nav links */}
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

          {/* Mobile-only section */}
          {!isBackoffice && (
            <div className="header-nav-mobile-section">
              <div className="header-nav-divider" />

              {isAuthenticated && user ? (
                <>
                  <div className="header-nav-user-info">
                    <User size={20} />
                    <div>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <a
                    href="#resumo"
                    className="header-nav-action-link"
                    onClick={(e) => { e.preventDefault(); scrollTo('#resumo'); }}
                  >
                    <ShoppingBag size={20} />
                    <span>Carrinho</span>
                    {itemCount > 0 && (
                      <span className="header-nav-badge">{itemCount}</span>
                    )}
                  </a>

                  {canAccessBackoffice && (
                    <Link
                      to="/backoffice"
                      className="header-nav-action-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      <LayoutDashboard size={20} />
                      <span>Painel Admin</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    className="header-nav-action-link header-nav-logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} />
                    <span>Terminar sessão</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="header-nav-action-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LogIn size={20} />
                    <span>Entrar</span>
                  </Link>
                  <Link
                    to="/cadastro"
                    className="header-nav-action-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <UserPlus size={20} />
                    <span>Criar conta</span>
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>

        <div className="header-actions">
          {/* Desktop-only: cart + user menu */}
          {!isBackoffice && (
            isAuthenticated ? (
              <>
                <a
                  href="#resumo"
                  className="header-icon-btn header-cart header-desktop-only"
                  onClick={(e) => { e.preventDefault(); scrollTo('#resumo'); }}
                >
                  <ShoppingBag size={20} />
                  {itemCount > 0 && <span className="header-cart-badge">{itemCount}</span>}
                </a>

                <div className="header-user-menu header-desktop-only" ref={userMenuRef}>
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
                        <strong>{user?.name}</strong>
                        <span>{user?.email}</span>
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
              </>
            ) : (
              <>
                <Link
                  to="/cadastro"
                  className="btn btn-outline btn-sm header-signup header-desktop-only"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="header-signup-text">Criar conta</span>
                </Link>
                <Link
                  to="/login"
                  className="btn btn-primary btn-sm header-login header-desktop-only"
                  onClick={() => setMenuOpen(false)}
                >
                  <LogIn size={16} />
                  <span className="header-login-text">Entrar</span>
                </Link>
              </>
            )
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
