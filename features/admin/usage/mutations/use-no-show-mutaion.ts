import { toast } from 'sonner'
import { useOptimisticTabMutation } from '../../_shared/mutations/use-optimistic-tab-mutation'
import { AdminBookingItem } from '../../_shared/types/admin-booking-item'
import { noShowUsage, NoShowUsagePayload } from '../api/no-show-usage'
import { UsageTabId } from '../constants/usage-tabs'
import { adminUsageQueryKeys } from '../query-keys'

function getNextTabAfterNoShow(currentTab: UsageTabId): UsageTabId | null {
  if (currentTab === 'key_out') return null
  return null
}

export function useNoShowMutation(currentTab: UsageTabId) {
  return useOptimisticTabMutation<
    UsageTabId,
    AdminBookingItem,
    NoShowUsagePayload,
    { success: true }
  >({
    mutationFn: noShowUsage,

    currentTab,

    listQueryKey: tab => adminUsageQueryKeys.list(tab),
    countsQueryKey: adminUsageQueryKeys.counts(),

    getPayloadId: payload => payload.usageSessionId,
    getItemId: item => item.reservationId,

    getNextTab: (_payload, tab) => getNextTabAfterNoShow(tab),

    getInvalidateTabs: (_payload, tab) => {
      const nextTab = getNextTabAfterNoShow(tab)
      return nextTab ? [nextTab] : []
    },

    onSuccessSideEffect: (_result, _payload) => {
      toast.success('노쇼 처리 완료')
    },

    onErrorSideEffect: () => {
      toast.error('노쇼 처리 실패')
    },
  })
}
