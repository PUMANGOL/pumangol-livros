import { Mail, MapPin, Phone, ExternalLink } from 'lucide-react';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
} from '../icons/SocialIcons';
import { useOrderModal } from '../../context/OrderModalContext';
import './Footer.css';

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/pumangol', Icon: FacebookIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/pumangol', Icon: InstagramIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/pumangol', Icon: LinkedInIcon },
  { label: 'YouTube', href: 'https://www.youtube.com/pumangol', Icon: YouTubeIcon },
];

const navLinks = [
  { href: '/#sobre', label: 'Sobre' },
  { href: '/#catalogo', label: 'Catálogo' },
  { href: '/#resumo', label: 'Resumo da encomenda' },
];

export function Footer() {
  const { openOrderModal } = useOrderModal();

  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    const hash = href.split('#')[1];
    if (!hash) return;

    if (window.location.pathname === '/') {
      e.preventDefault();
      document.querySelector(`#${hash}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer id="contatos" className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col footer-brand">
            <img src="/logo-pumangol.svg" alt="Pumangol" />
            <p className="footer-tagline">Cria boa energia.</p>
            <p className="footer-desc">
              Campanha escolar Bom Regresso às Aulas 2026. Encomende os manuais escolares e levante
              no posto Pumangol mais próximo.
            </p>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Navegação</h3>
            <ul className="footer-links">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={handleNavClick(link.href)}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button type="button" className="footer-link-btn" onClick={openOrderModal}>
                  Fazer encomenda
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Contatos</h3>
            <ul className="footer-contact-list">
              <li>
                <Phone size={16} aria-hidden />
                <a href="tel:+244923190800">923 190 800</a>
              </li>
              <li>
                <Mail size={16} aria-hidden />
                <a href="mailto:info@pumangol.co.ao">info@pumangol.co.ao</a>
              </li>
              <li>
                <ExternalLink size={16} aria-hidden />
                <a href="https://www.pumangol.co.ao" target="_blank" rel="noopener noreferrer">
                  www.pumangol.co.ao
                </a>
              </li>
              <li>
                <MapPin size={16} aria-hidden />
                <a href="https://www.pumangol.co.ao" target="_blank" rel="noopener noreferrer">
                  Mapa de postos Pumangol
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Apoio ao cliente</h3>
            <ul className="footer-info-list">
              <li>Levantamento em até 48h após a encomenda</li>
              <li>Pagamento no posto seleccionado para recolha</li>
              <li>Formas de pagamento: Cash ou Multicaixa</li>
              <li>Campanha válida enquanto durar o stock disponível</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-social">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
          <p className="footer-copy">&copy; 2026 Pumangol, Lda. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
