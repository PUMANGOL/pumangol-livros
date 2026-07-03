import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory } from '../api/categories';
import type { CreateCategoryDto } from '../types/api';

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCategoryDto) => createCategory(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
