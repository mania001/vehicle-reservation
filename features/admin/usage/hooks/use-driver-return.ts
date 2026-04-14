import { useQuery } from '@tanstack/react-query'
import { ReturnInfo } from '../types/return-info'

export function useDriverReturn({
  usageSessionId,
  enabled,
}: {
  usageSessionId: string
  enabled: boolean
}) {
  return useQuery({
    queryKey: ['driver-return', usageSessionId],
    queryFn: async (): Promise<ReturnInfo> => {
      const res = await fetch(`/api/admin/usage/${usageSessionId}/return/driver`)
      if (!res.ok) throw new Error('failed to fetch return info')
      return (await res.json()).data.item as ReturnInfo
    },
    enabled,
  })
}
