import type { Book, BookGrade } from '../types';

export const bookCoverImages = [
  '/livro1.jpg',
  '/livro2.jpg',
  '/livro3.jpg',
] as const;

type BookInput = {
  id: string;
  title: string;
  category: string;
  grade: string;
  educationLevel: string;
  price: number;
  author: string;
  isbn: string;
};

function toBookGrade(id: number, name: string, educationLevelId: string): BookGrade {
  return {
    id,
    name,
    slug: null,
    educationLevelId,
    sortOrder: null,
  };
}

const bookEntries: BookInput[] = [
  {
    id: '1',
    title: 'Matemática 6ª Classe',
    category: 'Académico',
    grade: '6ª Classe',
    educationLevel: 'Primário',
    price: 8500,
    author: 'Ministério da Educação',
    isbn: '978-989-1234-01-1',
  },
  {
    id: '2',
    title: 'Português 7ª Classe',
    category: 'Académico',
    grade: '7ª Classe',
    educationLevel: 'Primário',
    price: 7800,
    author: 'Ministério da Educação',
    isbn: '978-989-1234-02-8',
  },
  {
    id: '3',
    title: 'Ciências Naturais 8ª Classe',
    category: 'Académico',
    grade: '8ª Classe',
    educationLevel: 'Primário',
    price: 9200,
    author: 'Ministério da Educação',
    isbn: '978-989-1234-03-5',
  },
  {
    id: '4',
    title: 'Física 10ª Classe',
    category: 'Académico',
    grade: '10ª Classe',
    educationLevel: 'Secundário II Ciclo',
    price: 12500,
    author: 'Editora Escolar',
    isbn: '978-989-1234-04-2',
  },
  {
    id: '5',
    title: 'Química 11ª Classe',
    category: 'Académico',
    grade: '11ª Classe',
    educationLevel: 'Secundário II Ciclo',
    price: 13200,
    author: 'Editora Escolar',
    isbn: '978-989-1234-05-9',
  },
  {
    id: '6',
    title: 'História de Angola',
    category: 'Académico',
    grade: '9ª Classe',
    educationLevel: 'Secundário I Ciclo',
    price: 9800,
    author: 'Instituto Nacional',
    isbn: '978-989-1234-06-6',
  },
  {
    id: '7',
    title: 'Hábitos de Sucesso',
    category: 'Desenvolvimento Pessoal',
    grade: 'Geral',
    educationLevel: 'Secundário I Ciclo',
    price: 6500,
    author: 'Paulo Mendes',
    isbn: '978-989-1234-07-3',
  },
  {
    id: '8',
    title: 'Inteligência Emocional para Jovens',
    category: 'Desenvolvimento Pessoal',
    grade: 'Geral',
    educationLevel: 'Secundário II Ciclo',
    price: 7200,
    author: 'Ana Costa',
    isbn: '978-989-1234-08-0',
  },
  {
    id: '9',
    title: 'Electrotecnia Básica',
    category: 'Técnico',
    grade: 'Curso Técnico',
    educationLevel: 'Técnico Profissional',
    price: 14500,
    author: 'Instituto Técnico',
    isbn: '978-989-1234-09-7',
  },
  {
    id: '10',
    title: 'Informática Aplicada',
    category: 'Técnico',
    grade: 'Curso Técnico',
    educationLevel: 'Técnico Profissional',
    price: 13800,
    author: 'Instituto Técnico',
    isbn: '978-989-1234-10-3',
  },
  {
    id: '11',
    title: 'Contabilidade Geral',
    category: 'Economia e Gestão',
    grade: '12ª Classe',
    educationLevel: 'Secundário II Ciclo',
    price: 11200,
    author: 'Editora Negócios',
    isbn: '978-989-1234-11-0',
  },
  {
    id: '12',
    title: 'Empreendedorismo Jovem',
    category: 'Economia e Gestão',
    grade: 'Geral',
    educationLevel: 'Secundário II Ciclo',
    price: 8900,
    author: 'Editora Negócios',
    isbn: '978-989-1234-12-7',
  },
  {
    id: '13',
    title: 'Luanda em Versos',
    category: 'Literatura',
    grade: 'Geral',
    educationLevel: 'Secundário I Ciclo',
    price: 5500,
    author: 'José Eduardo Agualusa',
    isbn: '978-989-1234-13-4',
  },
  {
    id: '14',
    title: 'Contos da Nossa Terra',
    category: 'Literatura',
    grade: 'Geral',
    educationLevel: 'Primário',
    price: 4800,
    author: 'Pepetela',
    isbn: '978-989-1234-14-1',
  },
  {
    id: '15',
    title: 'A Aventura do Kimbanda',
    category: 'Infantil',
    grade: '1ª Classe',
    educationLevel: 'Primário',
    price: 3200,
    author: 'Maria Santos',
    isbn: '978-989-1234-15-8',
  },
  {
    id: '16',
    title: 'Aprender a Ler com Alegria',
    category: 'Infantil',
    grade: 'Pré-escolar',
    educationLevel: 'Primário',
    price: 2800,
    author: 'Pedagogia Infantil',
    isbn: '978-989-1234-16-5',
  },
  {
    id: '17',
    title: 'Geografia 8ª Classe',
    category: 'Académico',
    grade: '8ª Classe',
    educationLevel: 'Primário',
    price: 8700,
    author: 'Ministério da Educação',
    isbn: '978-989-1234-17-2',
  },
  {
    id: '18',
    title: 'Inglês 9ª Classe',
    category: 'Académico',
    grade: '9ª Classe',
    educationLevel: 'Secundário I Ciclo',
    price: 9500,
    author: 'Cambridge Angola',
    isbn: '978-989-1234-18-9',
  },
];

export const books: Book[] = bookEntries.map((book, index) => ({
  id: book.id,
  title: book.title,
  category: book.category,
  grades: [toBookGrade(Number(book.id), book.grade, book.educationLevel)],
  price: book.price,
  author: book.author,
  isbn: book.isbn,
  coverImage: bookCoverImages[index % bookCoverImages.length],
}));

export const categories = [
  { name: 'Académico' as const, icon: '📚', color: '#057143', description: 'Manuais escolares oficiais' },
  { name: 'Desenvolvimento Pessoal' as const, icon: '🌱', color: '#14B8A6', description: 'Crescimento e motivação' },
  { name: 'Técnico' as const, icon: '🔧', color: '#6366F1', description: 'Formação profissional' },
  { name: 'Economia e Gestão' as const, icon: '📊', color: '#F97316', description: 'Negócios e finanças' },
  { name: 'Literatura' as const, icon: '📖', color: '#8B5CF6', description: 'Clássicos e contemporâneos' },
  { name: 'Infantil' as const, icon: '🎒', color: '#FB7185', description: 'Primeiros passos na leitura' },
];

export const educationLevels = [
  'Primário',
  'Secundário I Ciclo',
  'Secundário II Ciclo',
  'Técnico Profissional',
] as const;

export const grades = [
  'Pré-escolar',
  '1ª Classe',
  '6ª Classe',
  '7ª Classe',
  '8ª Classe',
  '9ª Classe',
  '10ª Classe',
  '11ª Classe',
  '12ª Classe',
  'Curso Técnico',
  'Geral',
] as const;
