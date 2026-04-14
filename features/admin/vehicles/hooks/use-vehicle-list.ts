import { useQuery } from '@tanstack/react-query'
import { fetchVehicles } from '../api/fetch-vehicles'

export function useVehicleList() {
  return useQuery({
    queryKey: ['admin-vehicles'],
    queryFn: fetchVehicles,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  })
}
