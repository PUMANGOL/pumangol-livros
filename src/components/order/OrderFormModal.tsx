import { Modal } from '../ui/Modal';
import { OrderFormSection } from './OrderFormSection';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrderFormModal({ isOpen, onClose }: OrderFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Formulário de Encomenda"
      maxWidth="720px"
    >
      <OrderFormSection onClose={onClose} />
    </Modal>
  );
}
