import { VehicleListItem } from '../types/vehicle-list-item'

export async function fetchVehicles() {
  const res = await fetch('/api/admin/vehicles')
  if (!res.ok) throw new Error('Failed to fetch vehicles')
  return (await res.json()).data as Promise<{ items: VehicleListItem[] }>
}
