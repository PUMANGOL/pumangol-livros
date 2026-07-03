export function formatBookGradeNames(
  grades: { name: string }[] | null | undefined,
): string {
  if (!grades?.length) return '—';

  return grades.map((grade) => grade.name).join(', ');
}

export function formatBookEducationLevels(
  grades: { educationLevelId: string }[] | null | undefined,
): string {
  if (!grades?.length) return '—';

  const levels = [...new Set(
    grades
      .map((grade) => grade.educationLevelId?.trim())
      .filter(Boolean),
  )];

  return levels.length > 0 ? levels.join(', ') : '—';
}
