import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ImagePlus, Plus, Trash2, Upload, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Select } from '../../components/ui/Select';
import { useCategories } from '../../hooks/useCategories';
import { useLevels } from '../../hooks/useLevels';
import { useSchoolClasses } from '../../hooks/useSchoolClasses';
import { useCreateBook } from '../../hooks/useCreateBook';
import { useToast } from '../../context/ToastContext';
import './BackofficeAddBookPage.css';

interface SelectedGrade {
  id: number;
  name: string;
  educationLevel: string;
}

interface BookFormState {
  title: string;
  categoryId: string;
  price: string;
  author: string;
  isbn: string;
  available: boolean;
  image: File | null;
}

const initialForm: BookFormState = {
  title: '',
  categoryId: '',
  price: '',
  author: '',
  isbn: '',
  available: true,
  image: null,
};

export function BackofficeAddBookPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { mutate: createBook, isPending } = useCreateBook();
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const { data: levels = [], isLoading: isLevelsLoading } = useLevels();
  const [form, setForm] = useState<BookFormState>(initialForm);
  const [selectedGrades, setSelectedGrades] = useState<SelectedGrade[]>([]);
  const [educationLevelId, setEducationLevelId] = useState('');
  const [pendingGradeId, setPendingGradeId] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof BookFormState, string>>>({});
  const [gradesError, setGradesError] = useState<string | undefined>();
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const educationLevelNumeric = educationLevelId ? Number(educationLevelId) : 0;
  const { data: schoolClasses = [], isLoading: isSchoolClassesLoading } =
    useSchoolClasses(educationLevelNumeric);

  const selectedLevelName = levels.find((level) => String(level.id) === educationLevelId)?.name ?? '';

  useEffect(() => {
    if (!form.image) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(form.image);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  const updateField = <K extends keyof BookFormState>(key: K, value: BookFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleEducationLevelChange = (value: string) => {
    setEducationLevelId(value);
    setPendingGradeId('');
  };

  const handleAddGrade = () => {
    if (!educationLevelId) {
      setGradesError('Selecione o nível de ensino');
      return;
    }

    if (!pendingGradeId) {
      setGradesError('Selecione uma classe para adicionar');
      return;
    }

    const gradeId = Number(pendingGradeId);
    const schoolClass = schoolClasses.find((item) => item.id === gradeId);

    if (!schoolClass) return;

    if (selectedGrades.some((grade) => grade.id === gradeId)) {
      setGradesError('Esta classe já foi adicionada');
      return;
    }

    setSelectedGrades((prev) => [
      ...prev,
      {
        id: gradeId,
        name: schoolClass.name,
        educationLevel: selectedLevelName,
      },
    ]);
    setPendingGradeId('');
    setGradesError(undefined);
  };

  const handleRemoveGrade = (gradeId: number) => {
    setSelectedGrades((prev) => prev.filter((grade) => grade.id !== gradeId));
    if (gradesError) setGradesError(undefined);
  };

  const handleImageSelect = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Selecione um ficheiro de imagem.', 'error');
      return;
    }

    updateField('image', file);
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
    let nextGradesError: string | undefined;

    if (selectedGrades.length === 0) {
      nextGradesError = 'Adicione pelo menos uma classe';
    }

    if (!form.title.trim()) newErrors.title = 'Obrigatório';
    if (!form.categoryId) newErrors.categoryId = 'Selecione uma categoria';
    if (!form.price.trim()) newErrors.price = 'Obrigatório';
    else if (Number.isNaN(Number(form.price)) || Number(form.price) <= 0) {
      newErrors.price = 'Preço inválido';
    }
    if (!form.author.trim()) newErrors.author = 'Obrigatório';
    if (!form.isbn.trim()) newErrors.isbn = 'Obrigatório';
    if (!form.image) newErrors.image = 'Selecione uma imagem';

    setGradesError(nextGradesError);
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0 && !nextGradesError;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !form.image) return;

    createBook(
      {
        dto: {
          title: form.title.trim(),
          categoryId: Number(form.categoryId),
          grades: selectedGrades.map((grade) => grade.id),
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
          navigate('/backoffice/livros');
        },
        onError: () => {
          showToast('Não foi possível cadastrar o livro. Tente novamente.', 'error');
        },
      },
    );
  };

  return (
    <div className="backoffice-page backoffice-add-book-page">
      <div className="backoffice-header">
        <div className="backoffice-header-inner">
          <div className="backoffice-header-row">
            <div>
              <h1 className="section-title">Adicionar livro</h1>
              <p className="section-subtitle">
                Preencha os dados do livro e associe as classes correspondentes.
              </p>
            </div>
            <Link to="/backoffice/livros" className="btn btn-outline backoffice-add-book-back">
              <ArrowLeft size={16} />
              Voltar aos livros
            </Link>
          </div>
        </div>
      </div>

      <div className="backoffice-body">
        <div className="backoffice-add-book-card">
          <form className="add-book-form" onSubmit={handleSubmit}>
            <section className="add-book-grades-section">
              <div className="add-book-section-header">
                <h2 className="add-book-section-title">Classes</h2>
                <p className="add-book-section-subtitle">
                  Selecione o nível e a classe, depois adicione quantas classes forem necessárias.
                </p>
              </div>

              <div className="add-book-grades-picker">
                <div className="form-group">
                  <label className="form-label" htmlFor="book-level">Nível de ensino</label>
                  <Select
                    value={educationLevelId}
                    onChange={handleEducationLevelChange}
                    disabled={isLevelsLoading}
                    placeholder={isLevelsLoading ? 'A carregar...' : 'Selecione o nível'}
                    options={levels.map((level) => ({ value: String(level.id), label: level.name }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="book-grade">Classe</label>
                  <Select
                    value={pendingGradeId}
                    onChange={setPendingGradeId}
                    disabled={!educationLevelId || isSchoolClassesLoading}
                    placeholder={
                      !educationLevelId
                        ? 'Selecione o nível primeiro'
                        : isSchoolClassesLoading
                          ? 'A carregar...'
                          : 'Selecione a classe'
                    }
                    options={schoolClasses.map((schoolClass) => ({
                      value: String(schoolClass.id),
                      label: schoolClass.name,
                    }))}
                    clearable={false}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-primary add-book-grades-add"
                  onClick={handleAddGrade}
                  disabled={!educationLevelId || !pendingGradeId}
                  aria-label="Adicionar classe"
                >
                  <Plus size={16} />
                </button>
              </div>

              {gradesError && <span className="form-error add-book-grades-error">{gradesError}</span>}

              {selectedGrades.length > 0 ? (
                <div className="add-book-grades-table-wrap">
                  <table className="add-book-grades-table">
                    <thead>
                      <tr>
                        <th>Nível</th>
                        <th>Classe</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedGrades.map((grade) => (
                        <tr key={grade.id}>
                          <td>{grade.educationLevel}</td>
                          <td>{grade.name}</td>
                          <td>
                            <button
                              type="button"
                              className="add-book-grade-remove"
                              onClick={() => handleRemoveGrade(grade.id)}
                              aria-label={`Remover ${grade.name}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="add-book-grades-empty">
                  Nenhuma classe adicionada.
                </div>
              )}
            </section>

            <div className="add-book-form-divider" />

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
                  options={categories.map((category) => ({ value: String(category.id), label: category.name }))}
                  clearable={false}
                />
                {errors.categoryId && <span className="form-error">{errors.categoryId}</span>}
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

              <div className="form-group">
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
                  onChange={(e) => handleImageSelect(e.target.files?.[0] ?? null)}
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
                      errors.image && 'add-book-upload--error',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <span className="add-book-upload-icon" aria-hidden="true">
                      {isDragging ? <Upload size={28} /> : <ImagePlus size={28} />}
                    </span>
                    <span className="add-book-upload-title">
                      {isDragging ? 'Largue a imagem aqui' : 'Clique para escolher a capa'}
                    </span>
                    <span className="add-book-upload-hint">ou arraste e largue · PNG, JPG ou WEBP</span>
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
              <Link
                to="/backoffice/livros"
                className="btn btn-outline"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPending}
              >
                {isPending ? 'A guardar...' : 'Cadastrar livro'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
