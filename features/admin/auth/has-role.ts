import { AdminRole } from './admin-role'

export function hasRole(admin: { role: AdminRole }, role: AdminRole) {
  if (admin.role === 'super_admin') {
    return true
  }

  return admin.role === role
}
