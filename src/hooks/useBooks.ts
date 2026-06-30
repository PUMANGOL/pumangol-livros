import { useQuery } from '@tanstack/react-query';
import { fetchAllBooks } from '../api/books';

export function useBooks() {
  return useQuery({
    queryKey: ['books', 'all'],
    queryFn: fetchAllBooks,
  });
}
