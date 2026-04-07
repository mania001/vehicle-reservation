export const AdminRole = {
  RESERVATION_MANAGER: 'reservation_manager',
  VEHICLE_MANAGER: 'vehicle_manager',
  SUPER_ADMIN: 'super_admin',
} as const

export type AdminRole = (typeof AdminRole)[keyof typeof AdminRole]
