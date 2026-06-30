import { apiClient } from './client';
import type { ApiResponse, Level } from '../types/api';

export async function fetchLevels(): Promise<Level[]> {
  const { data } = await apiClient.get<ApiResponse<Level[]>>('/education-level');

  return data.data;
}
