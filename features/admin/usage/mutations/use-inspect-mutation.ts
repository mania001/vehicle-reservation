import { toast } from 'sonner'
import { useOptimisticTabMutation } from '../../_shared/mutations/use-optimistic-tab-mutation'
import { AdminBookingItem } from '../../_shared/types/admin-booking-item'
import { UsageTabId } from '../constants/usage-tabs'
import { adminUsageQueryKeys } from '../query-keys'
import { inspectUsage, InspectUsagePayload } from '../api/inspect-usage'
import { adminReservationQueryKeys } from '../../reservations/query-keys'

function getNextTabAfterInspect(currentTab: UsageTabId): UsageTabId | null {
  if (currentTab === 'returned') return null
  return null
}

export function useInspectMutation(currentTab: UsageTabId) {
  return useOptimisticTabMutation<
    UsageTabId,
    AdminBookingItem,
    InspectUsagePayload,
    { success: true }
  >({
    mutationFn: inspectUsage,

    currentTab,

    listQueryKey: tab => adminUsageQueryKeys.list(tab),
    countsQueryKey: adminUsageQueryKeys.counts(),

    getPayloadId: payload => payload.usageSessionId,
    getItemId: item => item.reservationId,

    getNextTab: (_payload, tab) => getNextTabAfterInspect(tab),

    getInvalidateTabs: (_payload, tab) => {
      const nextTab = getNextTabAfterInspect(tab)
      return nextTab ? [nextTab] : []
    },

    onSuccessSideEffect: (_result, _payload) => {
      toast.success('점검 완료')
    },

    onErrorSideEffect: () => {
      toast.error('점검 처리 실패')
    },

    extraInvalidateKeys: payload => {
      if (payload.issue) {
        return [
          adminReservationQueryKeys.list('issue'), // 리스트
          adminUsageQueryKeys.counts(), // 카운트
        ]
      } else {
        return [
          adminReservationQueryKeys.list('return_check'), // 리스트
          adminUsageQueryKeys.counts(), // 카운트
        ]
      }
    },
  })
}
