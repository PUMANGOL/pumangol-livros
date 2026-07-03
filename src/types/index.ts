export type BookCategory =
  | 'Académico'
  | 'Desenvolvimento Pessoal'
  | 'Técnico'
  | 'Economia e Gestão'
  | 'Literatura'
  | 'Infantil';

export type EducationLevel = 'Primário' | 'Secundário I Ciclo' | 'Secundário II Ciclo' | 'Técnico Profissional';

export interface BookGrade {
  id: number;
  name: string;
  slug: string | null;
  educationLevelId: string;
  sortOrder: number | null;
}

export interface Book {
  id: string;
  title: string;
  category: string;
  grades: BookGrade[];
  price: number;
  coverImage: string;
  author: string;
  isbn: string;
  description?: string | null;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export type OrderStatus = 'pendente' | 'confirmado' | 'preparado' | 'pronto_levantamento' | 'entregue';

export interface CustomerData {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  pickupPostId: string;
  pickupPostName?: string;
  notes: string;
  termsAccepted: boolean;
}

export interface Order {
  id: string;
  customer: CustomerData;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}
