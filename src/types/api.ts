export interface ApiResponse<T> {
  status: string;
  data: T;
  errors: unknown[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
}

export interface Level {
  id: number;
  name: string;
  slug: string;
}

export interface SchoolClass {
  id: number;
  name: string;
  slug: string;
}

export interface ApiBook {
  id: number;
  title: string;
  categoryId: number;
  category: string;
  gradeId: number;
  grade: string;
  quantity: number | null;
  educationLevelId: number;
  educationLevel: string;
  price: number;
  coverImage: string;
  author: string;
  isbn: string;
  available: boolean;
  description: string | null;
}

export interface BookFindParams {
  schoolClassId: number;
  categoryId: number;
  educationLevelId: number;
}

export interface CreateBookDto {
  title: string;
  categoryId: number;
  gradeId: number;
  price: number;
  author: string;
  isbn: string;
  available: boolean;
}

export interface CreateOrderCustomer {
  fullName: string;
  phone: string;
  email: string;
  location: string;
}

export interface CreateOrderItem {
  bookId: number;
  quantity: number;
}

export interface CreateOrderPayload {
  customer: CreateOrderCustomer;
  pickupPostId: number;
  notes: string;
  items: CreateOrderItem[];
  status?: string;
}

export interface ApiOrder {
  id: number | string;
  customer: CreateOrderCustomer & { pickupPostId?: number };
  pickupPostId?: number;
  notes?: string;
  items?: CreateOrderItem[];
  total?: number;
  status?: string;
  createdAt?: string;
}

export interface ApiOrderItem {
  id: number;
  bookId: number;
  book: string;
  quantity: number;
  price: number;
}

export interface ApiOrderDetail {
  id: number;
  customer: CreateOrderCustomer;
  pickupPostId: number;
  pickupPost: string;
  notes: string;
  items: ApiOrderItem[];
  status: string;
  createAt: string;
}

export interface PickupPost {
  id: number;
  name: string;
}

export interface AuthRole {
  id: number;
  name: string;
}

export interface AuthUser {
  id: number;
  email: string;
  password: string | null;
  name: string;
  msisdn: string;
  status: string;
  alterPassword: boolean;
  avatar: string | null;
  roles: AuthRole[];
  typeUser: number;
  perfil: string;
  active: boolean;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse {
  token: string;
  user: AuthUser;
}

export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
  msisdn: string;
  roles: number[];
}