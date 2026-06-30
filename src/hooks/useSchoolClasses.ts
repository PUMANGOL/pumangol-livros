import { useQuery } from '@tanstack/react-query';
import { fetchSchoolClasses } from '../api/schoolClasses';

export function useSchoolClasses(educationLevelId: number) {
  return useQuery({
    queryKey: ['school-classes', educationLevelId],
    queryFn: () => fetchSchoolClasses(educationLevelId),
  });
}
