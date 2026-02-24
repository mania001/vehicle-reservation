'use client'

import { useQuery } from '@tanstack/react-query'
import { UsageTabId } from '../constants/usage-tabs'
import { adminUsageQueryKeys } from '../query-keys'
import { fetchUsageList } from '../api/fetch-usage-list'

export function useAdminUsageList(tab: UsageTabId) {
  return useQuery({
    queryKey: adminUsageQueryKeys.list(tab),
    queryFn: () => fetchUsageList(tab),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30, // ✅ 30초마다 자동 갱신
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: false,
  })
}
