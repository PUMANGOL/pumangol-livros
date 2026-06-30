import { apiClient } from './client';
import type { ApiResponse, SchoolClass } from '../types/api';

export async function fetchSchoolClasses(
  educationLevelId: number,
): Promise<SchoolClass[]> {
  const { data } = await apiClient.get<ApiResponse<SchoolClass[]>>('/school-class', {
    params: { educationLevelId },
  });

  return data.data;
}
