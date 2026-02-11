import { UsageStatus } from '@/domains/usage-session/usage-status'
import { VehicleStatus } from '@/domains/vehicle/vehicle-status'

export type VehicleHistoryItem = {
  usageId: string
  startAt: string
  endAt: string
  status: UsageStatus
  reservationId: string | null
}

export type AvailableVehicle = {
  id: string
  name: string
  plateNumber: string
  status?: VehicleStatus
  lastUsedAt: string | null
  priority: number
  fuelLevel?: string
  fuelType?: string
  history: VehicleHistoryItem[]
  updatedAt?: string | null
}
