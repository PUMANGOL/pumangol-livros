import { useQuery } from '@tanstack/react-query';
import { fetchPickupPosts } from '../api/pickupPosts';

export function usePickupPosts() {
  return useQuery({
    queryKey: ['pickup-posts'],
    queryFn: fetchPickupPosts,
  });
}
