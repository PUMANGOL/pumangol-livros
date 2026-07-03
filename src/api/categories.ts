import { apiClient } from './client';
import type { ApiResponse, Category, CreateCategoryDto } from '../types/api';

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<ApiResponse<Category[]>>('/category');

  return data.data;
}

export async function createCategory(dto: CreateCategoryDto): Promise<Category> {
  const { data } = await apiClient.post<ApiResponse<Category>>('/category', dto);

  return data.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/category/${id}`);
}
