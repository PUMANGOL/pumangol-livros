import { apiClient } from './client';
import type { ApiResponse, Page, PickupPost } from '../types/api';

export async function fetchPickupPosts(): Promise<PickupPost[]> {
  const all: PickupPost[] = [];
  let page = 0;
  let last = false;

  while (!last) {
    const { data } = await apiClient.get<ApiResponse<Page<PickupPost>>>('/pickup-post', {
      params: { page, size: 50 },
    });

    const pageData = data.data;
    all.push(...pageData.content);
    last = pageData.last;
    page += 1;
  }

  return all;
}
