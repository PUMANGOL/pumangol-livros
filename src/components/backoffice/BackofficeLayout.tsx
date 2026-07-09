import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { BookOpen, FolderOpen, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { BackofficeUserMenu } from './BackofficeUserMenu';
import './BackofficeLayout.css';
import '../../pages/BackofficePage.css';

const navItems = [
  { to: '/backoffice/encomendas', label: 'Encomendas', icon: Package },
  { to: '/backoffice/livros', label: 'Livros', icon: BookOpen },
  { to: '/backoffice/categorias', label: 'Categorias', icon: FolderOpen },
];

export function BackofficeLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`backoffice-layout${collapsed ? ' backoffice-layout--collapsed' : ''}`}>
      <aside className={`backoffice-sidebar${collapsed ? ' backoffice-sidebar--collapsed' : ''}`}>
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
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `backoffice-sidebar-link${isActive ? ' backoffice-sidebar-link--active' : ''}`
              }
            >
              <Icon size={18} />
              <span className="backoffice-sidebar-link-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="backoffice-sidebar-footer">
          <BackofficeUserMenu collapsed={collapsed} />
        </div>

        <button
          className="backoffice-sidebar-toggle"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expandir menu' : 'Encolher menu'}
          aria-label={collapsed ? 'Expandir menu' : 'Encolher menu'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      <div className="backoffice-main">
        <Outlet />
      </div>
    </div>
  );
}
