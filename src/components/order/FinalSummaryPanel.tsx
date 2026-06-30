import { Mail, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import './FinalSummaryPanel.css';

export function FinalSummaryPanel() {
  const { items, total, itemCount } = useCart();

  return (
    <aside className="panel final-summary">
      <div className="panel-header">
        <h2>Resumo Final</h2>
      </div>

      <div className="panel-body">
        <div className="final-summary-content">
          <div className="final-summary-totals">
            <div className="final-summary-row">
              <span>Itens na encomenda</span>
              <span>{itemCount}</span>
            </div>
            <div className="final-summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="final-summary-row final-summary-total">
              <span>Total estimado</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="final-summary-notifications">
            <div className="notification-box">
              <div className="notification-box-icon">
                <Mail size={18} />
              </div>
              <div>
                <strong>Email</strong>
                <p>
                  Será gerado um texto estruturado com o resumo da encomenda para envio por email
                  {items.length > 0 && ' após submissão'}.
                </p>
              </div>
            </div>

            <div className="notification-box">
              <div className="notification-box-icon whatsapp">
                <MessageCircle size={18} />
              </div>
              <div>
                <strong>WhatsApp</strong>
                <p>
                  Será preparada uma mensagem pronta para envio via WhatsApp com os detalhes do pedido
                  {items.length > 0 && ' e confirmação imediata'}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
