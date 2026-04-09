import { FuelType, VehicleStatus } from '@/domains/vehicle/vehicle-status'

export type InputVehicle = {
  name: string
  plateNumber: string
  status?: VehicleStatus
  mileage?: number
  lastParkingZone?: string | null
  lastParkingNumber?: string | null
  priority?: number
  fuelLevel?: number
  fuelType: FuelType
}
