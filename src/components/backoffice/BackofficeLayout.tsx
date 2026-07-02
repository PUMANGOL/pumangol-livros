import { Link, NavLink, Outlet } from 'react-router-dom';
import { BookOpen, Package } from 'lucide-react';
import { BackofficeUserMenu } from './BackofficeUserMenu';
import './BackofficeLayout.css';
import '../../pages/BackofficePage.css';

const navItems = [
  { to: '/backoffice/encomendas', label: 'Encomendas', icon: Package },
  { to: '/backoffice/livros', label: 'Livros', icon: BookOpen },
];

export function BackofficeLayout() {
  return (
    <div className="backoffice-layout">
      <aside className="backoffice-sidebar">
        <div className="backoffice-sidebar-top">
          <Link to="/" className="backoffice-sidebar-logo">
            <img src="/logo-pumangol.svg" alt="Pumangol — Cria boa energia" />
          </Link>
        </div>

        <nav className="backoffice-sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `backoffice-sidebar-link${isActive ? ' backoffice-sidebar-link--active' : ''}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="backoffice-sidebar-footer">
          <BackofficeUserMenu />
        </div>
      </aside>

      <div className="backoffice-main">
        <Outlet />
      </div>
    </div>
  );
}
