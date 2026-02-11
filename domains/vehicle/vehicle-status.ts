export const VehicleStatus = {
  AVAILABLE: 'available',
  MAINTENANCE: 'maintenance',
  INACTIVE: 'inactive',
} as const

export type VehicleStatus = (typeof VehicleStatus)[keyof typeof VehicleStatus]
