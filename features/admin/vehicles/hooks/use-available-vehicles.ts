import { useQuery } from '@tanstack/react-query'
import { AvailableVehicle } from '../types/availabe-vehicles'

export function useAvailableVehicles(startAt: string, endAt: string, enabled: boolean) {
  return useQuery({
    queryKey: ['available-vehicles', startAt, endAt],
    enabled,
    queryFn: async (): Promise<AvailableVehicle[]> => {
      const res = await fetch(
        `/api/admin/vehicles/available?startAt=${encodeURIComponent(startAt)}&endAt=${encodeURIComponent(endAt)}`,
      )
      if (!res.ok) throw new Error('failed to fetch vehicles')
      const data = await res.json()
      return data.items
    },
  })
}
