import { Modal } from './Modal';
import './ConfirmModal.css';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  variant?: 'danger' | 'default';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isPending = false,
  variant = 'default',
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="480px">
      <div className="confirm-modal">
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <button
            type="button"
            className="btn btn-outline confirm-modal-cancel"
            onClick={onClose}
            disabled={isPending}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn confirm-modal-confirm ${
              variant === 'danger' ? 'confirm-modal-confirm--danger' : 'btn-primary'
            }`}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'A processar...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
