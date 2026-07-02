import { apiClient } from './client';
import type { ApiResponse, ApiBook, BookFindParams, CreateBookDto, Page } from '../types/api';
import type { Book } from '../types';

function extractBooks(data: ApiBook[] | Page<ApiBook>): ApiBook[] {
  return Array.isArray(data) ? data : data.content;
}

export async function fetchAllBooks(): Promise<ApiBook[]> {
  const { data } = await apiClient.get<ApiResponse<ApiBook[] | Page<ApiBook>>>('/book');

  return extractBooks(data.data);
}

export async function findBooks(params: BookFindParams): Promise<ApiBook[]> {
  const { data } = await apiClient.get<ApiResponse<Page<ApiBook>>>('/book/find', {
    params,
  });

  return extractBooks(data.data);
}

export async function createBook(dto: CreateBookDto, image: File): Promise<ApiBook> {
  const formData = new FormData();
  formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
  formData.append('imagem', image);

  const { data } = await apiClient.post<ApiResponse<ApiBook>>('/book', formData);

  return data.data;
}

export async function deleteBook(id: number): Promise<void> {
  await apiClient.delete(`/book/${id}`);
}

export function mapApiBookToBook(apiBook: ApiBook): Book {
  return {
    id: String(apiBook.id),
    title: apiBook.title,
    category: apiBook.category as Book['category'],
    grade: apiBook.grade,
    educationLevel: apiBook.educationLevel as Book['educationLevel'],
    price: apiBook.price,
    coverImage: apiBook.coverImage,
    author: apiBook.author,
    isbn: apiBook.isbn,
  };
}
