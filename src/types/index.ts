export type BookCategory =
  | 'Académico'
  | 'Desenvolvimento Pessoal'
  | 'Técnico'
  | 'Economia e Gestão'
  | 'Literatura'
  | 'Infantil';

export type EducationLevel = 'Primário' | 'Secundário I Ciclo' | 'Secundário II Ciclo' | 'Técnico Profissional';

export interface Book {
  id: string;
  title: string;
  category: BookCategory;
  grade: string;
  educationLevel: EducationLevel;
  price: number;
  coverImage: string;
  author: string;
  isbn: string;
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
