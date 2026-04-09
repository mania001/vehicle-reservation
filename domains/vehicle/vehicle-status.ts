export const VehicleStatus = {
  AVAILABLE: 'available',
  MAINTENANCE: 'maintenance',
  INACTIVE: 'inactive',
} as const

export type VehicleStatus = (typeof VehicleStatus)[keyof typeof VehicleStatus]

export const VEHICLE_STATUS_MAP = {
  available: '정상운행',
  maintenance: '점검중',
  inactive: '사용불가',
} as const

export const FuelType = {
  gasoline: 'gasoline',
  diesel: 'diesel',
  lpg: 'lpg',
  hybrid: 'hybrid',
  electric: 'electric',
} as const

export type FuelType = (typeof FuelType)[keyof typeof FuelType]

export const FUEL_TYPE_MAP = {
  gasoline: '휘발유',
  diesel: '경유',
  lpg: 'LPG',
  hybrid: '하이브리드',
  electric: '전기',
} as const // 'as const'를 붙여야 객체의 키가 고정됩니다
