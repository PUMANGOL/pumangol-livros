import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBook } from '../api/books';
import type { CreateBookDto } from '../types/api';

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dto, imagem }: { dto: CreateBookDto; imagem: File }) => createBook(dto, imagem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}
