import { useQuery } from '@tanstack/react-query'
import { fetchVehicles } from '../api/fetch-vehicles'

export function useVehicleList() {
  return useQuery({
    queryKey: ['admin-vehicles'],
    queryFn: fetchVehicles,
  })
}
