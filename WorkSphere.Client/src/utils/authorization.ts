export type UserRole = 'Admin' | 'HR' | 'Employee';

export function hasRole(role: string | null, allowedRoles: readonly UserRole[]): boolean {
  return role !== null && allowedRoles.includes(role as UserRole);
}

export function canManage(role: string | null): boolean {
  return hasRole(role, ['Admin', 'HR']);
}

export function canDelete(role: string | null): boolean {
  return hasRole(role, ['Admin']);
}
