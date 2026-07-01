import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Upload, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { useCategories } from '../../hooks/useCategories';
import { useLevels } from '../../hooks/useLevels';
import { useSchoolClasses } from '../../hooks/useSchoolClasses';
import { useCreateBook } from '../../hooks/useCreateBook';
import { useToast } from '../../context/ToastContext';
import { compressImage } from '../../utils/compressImage';
import { getApiErrorMessage } from '../../utils/apiErrors';
import './AddBookModal.css';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookFormState {
  title: string;
  categoryId: string;
  educationLevelId: string;
  gradeId: string;
  price: string;
  author: string;
  isbn: string;
  available: boolean;
  image: File | null;
}

const initialForm: BookFormState = {
  title: '',
  categoryId: '',
  educationLevelId: '',
  gradeId: '',
  price: '',
  author: '',
  isbn: '',
  available: true,
  image: null,
};

export function AddBookModal({ isOpen, onClose }: AddBookModalProps) {
  const { showToast } = useToast();
  const { mutate: createBook, isPending } = useCreateBook();
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const { data: levels = [], isLoading: isLevelsLoading } = useLevels();
  const [form, setForm] = useState<BookFormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof BookFormState, string>>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const educationLevelId = form.educationLevelId ? Number(form.educationLevelId) : 0;
  const { data: schoolClasses = [], isLoading: isSchoolClassesLoading } =
    useSchoolClasses(educationLevelId);

  useEffect(() => {
    if (!form.image) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(form.image);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const updateField = <K extends keyof BookFormState>(key: K, value: BookFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleImageSelect = async (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Selecione um ficheiro de imagem.', 'error');
      return;
    }

    setIsProcessingImage(true);

    try {
      const compressed = await compressImage(file);
      updateField('image', compressed);

      if (compressed.size < file.size) {
        showToast('Imagem optimizada para envio.');
      }
    } catch (error) {
      showToast(
        getApiErrorMessage(error, 'Não foi possível processar a imagem.'),
        'error',
      );
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleRemoveImage = () => {
    updateField('image', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageSelect(e.dataTransfer.files?.[0] ?? null);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BookFormState, string>> = {};

    if (!form.title.trim()) newErrors.title = 'Obrigatório';
    if (!form.categoryId) newErrors.categoryId = 'Selecione uma categoria';
    if (!form.gradeId) newErrors.gradeId = 'Selecione uma classe';
    if (!form.price.trim()) newErrors.price = 'Obrigatório';
    else if (Number.isNaN(Number(form.price)) || Number(form.price) <= 0) {
      newErrors.price = 'Preço inválido';
    }
    if (!form.author.trim()) newErrors.author = 'Obrigatório';
    if (!form.isbn.trim()) newErrors.isbn = 'Obrigatório';
    if (!form.image) newErrors.image = 'Selecione uma imagem';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !form.image) return;

    createBook(
      {
        dto: {
          title: form.title.trim(),
          categoryId: Number(form.categoryId),
          gradeId: Number(form.gradeId),
          price: Number(form.price),
          author: form.author.trim(),
          isbn: form.isbn.trim(),
          available: form.available,
        },
        imagem: form.image,
      },
      {
        onSuccess: () => {
          showToast('Livro cadastrado com sucesso!');
          handleClose();
        },
        onError: (error) => {
          showToast(
            getApiErrorMessage(error, 'Não foi possível cadastrar o livro. Tente novamente.'),
            'error',
          );
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Adicionar livro"
      maxWidth="720px"
    >
      <form className="add-book-form" onSubmit={handleSubmit}>
        <div className="add-book-form-grid">
          <div className="form-group form-group-full">
            <label className="form-label" htmlFor="book-title">Título</label>
            <input
              id="book-title"
              className={`form-input ${errors.title ? 'error' : ''}`}
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Ex: Gramática de Português"
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="book-category">Categoria</label>
            <Select
              error={Boolean(errors.categoryId)}
              value={form.categoryId}
              onChange={(value) => updateField('categoryId', value)}
              disabled={isCategoriesLoading}
              placeholder={isCategoriesLoading ? 'A carregar...' : 'Selecione a categoria'}
              options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
              clearable={false}
            />
            {errors.categoryId && <span className="form-error">{errors.categoryId}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="book-level">Nível de ensino</label>
            <Select
              value={form.educationLevelId}
              onChange={(value) => {
                updateField('educationLevelId', value);
                updateField('gradeId', '');
              }}
              disabled={isLevelsLoading}
              placeholder={isLevelsLoading ? 'A carregar...' : 'Selecione o nível'}
              options={levels.map((l) => ({ value: String(l.id), label: l.name }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="book-grade">Classe</label>
            <Select
              error={Boolean(errors.gradeId)}
              value={form.gradeId}
              onChange={(value) => updateField('gradeId', value)}
              disabled={!form.educationLevelId || isSchoolClassesLoading}
              placeholder={
                !form.educationLevelId
                  ? 'Selecione o nível primeiro'
                  : isSchoolClassesLoading
                    ? 'A carregar...'
                    : 'Selecione a classe'
              }
              options={schoolClasses.map((c) => ({ value: String(c.id), label: c.name }))}
              clearable={false}
            />
            {errors.gradeId && <span className="form-error">{errors.gradeId}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="book-price">Preço (Kz)</label>
            <input
              id="book-price"
              type="number"
              min="1"
              step="1"
              className={`form-input ${errors.price ? 'error' : ''}`}
              value={form.price}
              onChange={(e) => updateField('price', e.target.value)}
              placeholder="Ex: 5000"
            />
            {errors.price && <span className="form-error">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="book-author">Autor</label>
            <input
              id="book-author"
              className={`form-input ${errors.author ? 'error' : ''}`}
              value={form.author}
              onChange={(e) => updateField('author', e.target.value)}
              placeholder="Ex: Ministério da Educação"
            />
            {errors.author && <span className="form-error">{errors.author}</span>}
          </div>

          <div className="form-group form-group-full">
            <label className="form-label" htmlFor="book-isbn">ISBN</label>
            <input
              id="book-isbn"
              className={`form-input ${errors.isbn ? 'error' : ''}`}
              value={form.isbn}
              onChange={(e) => updateField('isbn', e.target.value)}
              placeholder="Ex: 988-989-1234-01-1"
            />
            {errors.isbn && <span className="form-error">{errors.isbn}</span>}
          </div>

          <div className="form-group form-group-full">
            <span className="form-label">Capa do livro</span>
            <input
              ref={fileInputRef}
              id="book-image"
              type="file"
              accept="image/*"
              className="add-book-file-input"
              onChange={(e) => {
                void handleImageSelect(e.target.files?.[0] ?? null);
              }}
            />

            {form.image && previewUrl ? (
              <div className={`add-book-upload add-book-upload--filled ${errors.image ? 'add-book-upload--error' : ''}`}>
                <div className="add-book-upload-preview">
                  <img src={previewUrl} alt="Pré-visualização da capa" />
                </div>
                <div className="add-book-upload-details">
                  <span className="add-book-upload-filename">{form.image.name}</span>
                  <span className="add-book-upload-size">
                    {(form.image.size / 1024).toFixed(0)} KB
                  </span>
                  <div className="add-book-upload-actions">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Substituir
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm add-book-upload-remove"
                      onClick={handleRemoveImage}
                      aria-label="Remover imagem"
                    >
                      <X size={16} />
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className={[
                  'add-book-upload',
                  isDragging && 'add-book-upload--dragging',
                  isProcessingImage && 'add-book-upload--processing',
                  errors.image && 'add-book-upload--error',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => !isProcessingImage && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                disabled={isProcessingImage}
              >
                <span className="add-book-upload-icon" aria-hidden="true">
                  {isProcessingImage ? (
                    <span className="add-book-upload-spinner" />
                  ) : isDragging ? (
                    <Upload size={28} />
                  ) : (
                    <ImagePlus size={28} />
                  )}
                </span>
                <span className="add-book-upload-title">
                  {isProcessingImage
                    ? 'A optimizar imagem...'
                    : isDragging
                      ? 'Largue a imagem aqui'
                      : 'Clique para escolher a capa'}
                </span>
                <span className="add-book-upload-hint">
                  ou arraste e largue · PNG, JPG ou WEBP · optimizada automaticamente
                </span>
              </button>
            )}

            {errors.image && <span className="form-error">{errors.image}</span>}
          </div>

          <div className="form-group form-group-full">
            <label className="add-book-checkbox">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => updateField('available', e.target.checked)}
              />
              Livro disponível para encomenda
            </label>
          </div>
        </div>

        <div className="add-book-form-actions">
          <button
            type="button"
            className="btn btn-outline add-book-form-cancel"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary add-book-form-submit"
            disabled={isPending}
          >
            {isPending ? 'A guardar...' : 'Cadastrar livro'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
