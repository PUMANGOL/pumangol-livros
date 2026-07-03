import { apiClient } from './client';
import type { ApiResponse, ApiBook, BookFindParams, CreateBookDto, Page } from '../types/api';
import type { Book } from '../types';

export const BOOKS_PAGE_SIZE = 8;

export async function fetchBooksPage(
  page: number,
  size = BOOKS_PAGE_SIZE,
): Promise<Page<ApiBook>> {
  const { data } = await apiClient.get<ApiResponse<Page<ApiBook>>>('/book', {
    params: { page, size },
  });

  return data.data;
}

export async function findBooksPage(
  page: number,
  filters: BookFindParams,
  size = BOOKS_PAGE_SIZE,
): Promise<Page<ApiBook>> {
  const { data } = await apiClient.get<ApiResponse<Page<ApiBook>>>('/book/find', {
    params: {
      page,
      size,
      ...filters,
    },
  });

  return data.data;
}

export async function fetchAllBooksForLookup(): Promise<ApiBook[]> {
  const firstPage = await fetchBooksPage(0);
  const allBooks = [...firstPage.content];

  if (firstPage.totalPages <= 1) return allBooks;

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
      fetchBooksPage(index + 1),
    ),
  );

  remainingPages.forEach((booksPage) => {
    allBooks.push(...booksPage.content);
  });

  return allBooks;
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
    category: apiBook.category,
    grades: apiBook.grades ?? [],
    price: apiBook.price,
    coverImage: apiBook.coverImage,
    author: apiBook.author,
    isbn: apiBook.isbn,
    description: apiBook.description,
  };
}
