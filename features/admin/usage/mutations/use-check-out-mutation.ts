import { toast } from 'sonner'
import { useOptimisticTabMutation } from '../../_shared/mutations/use-optimistic-tab-mutation'
import { AdminBookingItem } from '../../_shared/types/admin-booking-item'
import { UsageTabId } from '../constants/usage-tabs'
import { adminUsageQueryKeys } from '../query-keys'
import { checkOutUsage, CheckOutUsagePayload } from '../api/check-out-usage'

function getNextTabAfterKeyOut(currentTab: UsageTabId): UsageTabId | null {
  if (currentTab === 'key_out') return 'driving'
  return null
}

export function useCheckOutMutation(currentTab: UsageTabId) {
  return useOptimisticTabMutation<
    UsageTabId,
    AdminBookingItem,
    CheckOutUsagePayload,
    { success: true }
  >({
    mutationFn: checkOutUsage,

    currentTab,

    listQueryKey: tab => adminUsageQueryKeys.list(tab),
    countsQueryKey: adminUsageQueryKeys.counts(),

    getPayloadId: payload => payload.usageSessionId,
    getItemId: item => item.reservationId,

    getNextTab: (_payload, tab) => getNextTabAfterKeyOut(tab),

    getInvalidateTabs: (_payload, tab) => {
      const nextTab = getNextTabAfterKeyOut(tab)
      return nextTab ? [nextTab] : []
    },

    onSuccessSideEffect: (_result, _payload) => {
      toast.success('키 배출 완료')
    },

    onErrorSideEffect: () => {
      toast.error('키 배출 처리 실패')
    },
  })
}
