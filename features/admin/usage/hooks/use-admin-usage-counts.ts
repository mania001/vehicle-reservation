'use client'

import { useQuery } from '@tanstack/react-query'
import { adminUsageQueryKeys } from '../query-keys'
import { fetchUsageCounts } from '../api/fetch-usage-counts'

export function useAdminUsageCounts() {
  return useQuery({
    queryKey: adminUsageQueryKeys.counts(),
    queryFn: () => fetchUsageCounts(),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30, // ✅ 30초마다 자동 갱신
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: false,
  })
}
