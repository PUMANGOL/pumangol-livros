import { useQuery } from '@tanstack/react-query';
import { findBooks } from '../api/books';
import type { BookFindParams } from '../types/api';

export function useFindBooks(params: BookFindParams, enabled: boolean) {
  return useQuery({
    queryKey: ['books', 'find', params],
    queryFn: () => findBooks(params),
    enabled,
  });
}
