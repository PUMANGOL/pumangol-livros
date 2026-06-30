import { apiClient } from './client';
import type { ApiResponse, Category } from '../types/api';

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<ApiResponse<Category[]>>('/category');

  return data.data;
}
