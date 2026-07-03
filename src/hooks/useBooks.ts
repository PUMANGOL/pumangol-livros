import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchAllBooksForLookup, fetchBooksPage } from '../api/books';

export function useBooksPage(page: number) {
  return useQuery({
    queryKey: ['books', 'page', page],
    queryFn: () => fetchBooksPage(page),
    placeholderData: keepPreviousData,
  });
}

export function useBooksLookup() {
  return useQuery({
    queryKey: ['books', 'lookup'],
    queryFn: fetchAllBooksForLookup,
    staleTime: 5 * 60 * 1000,
  });
}
