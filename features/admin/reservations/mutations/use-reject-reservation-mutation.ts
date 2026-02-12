import { toast } from 'sonner'
import { useOptimisticTabMutation } from '../../_shared/mutations/use-optimistic-tab-mutation'
import { rejectReservation, RejectReservationPayload } from '../api/reject-reservation'
import { ReservationTabId } from '../constants/reservation-tabs'
import { adminReservationQueryKeys } from '../query-keys'
import { AdminReservationListItem } from '../types/reservaiton-list-item'

function getNextTabAfterReject(currentTab: ReservationTabId): ReservationTabId | null {
  if (currentTab === 'pending') return 'done'
  return null
}

export function useRejectReservationMutation(currentTab: ReservationTabId) {
  return useOptimisticTabMutation<
    ReservationTabId,
    AdminReservationListItem,
    RejectReservationPayload,
    { success: true }
  >({
    mutationFn: rejectReservation,

    currentTab,

    listQueryKey: tab => adminReservationQueryKeys.list(tab),
    countsQueryKey: adminReservationQueryKeys.counts(),

    getPayloadId: payload => payload.reservationId,
    getItemId: item => item.reservationId,

    getNextTab: (_payload, tab) => getNextTabAfterReject(tab),

    getInvalidateTabs: (_payload, tab) => {
      const nextTab = getNextTabAfterReject(tab)
      return nextTab ? [nextTab] : []
    },

    onSuccessSideEffect: (_result, _payload) => {
      toast.success('반려 완료')
    },

    onErrorSideEffect: () => {
      toast.error('반려 처리 실패')
    },
  })
}
