import type { AuthUser } from '../types/api';

const BACKOFFICE_ROLES = new Set(['MANAGER', 'ADMIN']);

export function canAccessBackoffice(user: AuthUser | null): boolean {
  if (!user) return false;

  return user.roles.some((role) => BACKOFFICE_ROLES.has(role.name));
}
