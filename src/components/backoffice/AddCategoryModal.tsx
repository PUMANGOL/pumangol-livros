import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useCreateCategory } from '../../hooks/useCreateCategory';
import { useToast } from '../../context/ToastContext';
import './AddCategoryModal.css';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryFormState {
  name: string;
  slug: string;
  color: string;
  description: string;
}

const initialForm: CategoryFormState = {
  name: '',
  slug: '',
  color: '#057143',
  description: '',
};

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const { showToast } = useToast();
  const { mutate: createCategory, isPending } = useCreateCategory();
  const [form, setForm] = useState<CategoryFormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormState, string>>>({});
  const [slugTouched, setSlugTouched] = useState(false);

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setSlugTouched(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const updateField = <K extends keyof CategoryFormState>(key: K, value: CategoryFormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };

      if (key === 'name' && !slugTouched) {
        next.slug = slugify(value);
      }

      return next;
    });

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CategoryFormState, string>> = {};

    if (!form.name.trim()) newErrors.name = 'Obrigatório';
    if (!form.description.trim()) newErrors.description = 'Obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const slug = form.slug.trim() || slugify(form.name);

    createCategory(
      {
        name: form.name.trim(),
        slug,
        icon: '',
        color: form.color.trim(),
        description: form.description.trim(),
      },
      {
        onSuccess: () => {
          showToast('Categoria cadastrada com sucesso!');
          handleClose();
        },
        onError: () => {
          showToast('Não foi possível cadastrar a categoria. Tente novamente.', 'error');
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Adicionar categoria"
      maxWidth="560px"
    >
      <form className="add-category-form" onSubmit={handleSubmit}>
        <div className="add-category-form-grid">
          <div className="form-group form-group-full">
            <label className="form-label" htmlFor="category-name">Nome</label>
            <input
              id="category-name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Ex: Académico"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group form-group-full">
            <label className="form-label" htmlFor="category-slug">Slug</label>
            <input
              id="category-slug"
              className="form-input"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                updateField('slug', e.target.value);
              }}
              placeholder="Ex: academico"
            />
          </div>

          <div className="form-group form-group-full">
            <label className="form-label" htmlFor="category-color">Cor</label>
            <div className="add-category-color-field">
              <input
                id="category-color"
                type="color"
                className="add-category-color-picker"
                value={form.color || '#057143'}
                onChange={(e) => updateField('color', e.target.value)}
                aria-label="Selecionar cor"
              />
              <input
                className="form-input"
                value={form.color}
                onChange={(e) => updateField('color', e.target.value)}
                placeholder="#057143"
              />
            </div>
          </div>

          <div className="form-group form-group-full">
            <label className="form-label" htmlFor="category-description">Descrição</label>
            <textarea
              id="category-description"
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Ex: Manuais escolares oficiais"
              rows={3}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>
        </div>

        <div className="add-category-form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isPending}
          >
            {isPending ? 'A guardar...' : 'Cadastrar categoria'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
