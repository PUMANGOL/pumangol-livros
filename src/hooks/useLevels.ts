import { useQuery } from '@tanstack/react-query';
import { fetchLevels } from '../api/levels';

export function useLevels() {
  return useQuery({
    queryKey: ['levels'],
    queryFn: fetchLevels,
  });
}
