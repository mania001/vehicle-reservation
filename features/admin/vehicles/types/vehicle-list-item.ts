export type VehicleListItem = {
  id: string
  name: string
  plateNumber: string
  status: 'available' | 'maintenance' | 'inactive'
  mileage: number
  lastParkingZone: string | null
  lastParkingNumber: string | null
  priority: number
  fuelLevel: number
  fuelType: 'gasoline' | 'diesel' | 'lpg' | 'hybrid' | 'electric'
}
