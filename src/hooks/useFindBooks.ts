import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { findBooksPage } from '../api/books';
import type { BookFindParams } from '../types/api';

export function useFindBooksPage(
  params: BookFindParams,
  page: number,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ['books', 'find', params, page],
    queryFn: () => findBooksPage(page, params),
    enabled,
    placeholderData: keepPreviousData,
  });
}
