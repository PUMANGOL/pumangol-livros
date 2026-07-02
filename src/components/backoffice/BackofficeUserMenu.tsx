import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronUp, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './BackofficeUserMenu.css';

export function BackofficeUserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  if (!user) return null;

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    showToast('Sessão terminada.');
    navigate('/');
  };

  return (
    <div className="backoffice-user-menu" ref={menuRef}>
      {isOpen && (
        <div className="backoffice-user-dropdown" role="menu">
          <div className="backoffice-user-dropdown-info">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <div className="backoffice-user-dropdown-divider" role="separator" />
          <Link
            to="/"
            className="backoffice-user-dropdown-item"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Ir para o site
          </Link>
          <div className="backoffice-user-dropdown-divider" role="separator" />
          <button
            type="button"
            className="backoffice-user-dropdown-logout"
            role="menuitem"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Terminar sessão
          </button>
        </div>
      )}

      <button
        type="button"
        className={`backoffice-user-trigger${isOpen ? ' backoffice-user-trigger--active' : ''}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="backoffice-user-trigger-icon" aria-hidden="true">
          <User size={18} />
        </span>
        <span className="backoffice-user-trigger-text">
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </span>
        <ChevronUp
          size={16}
          className={`backoffice-user-trigger-chevron${isOpen ? ' backoffice-user-trigger-chevron--open' : ''}`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
