'use client'

import { toast } from 'sonner'
import { useOptimisticTabMutation } from '../../_shared/mutations/use-optimistic-tab-mutation'
import { AdminBookingItem } from '../../_shared/types/admin-booking-item'
import { closeReservation, CloseReservationPayload } from '../api/close-reservation'
import { ReservationTabId } from '../constants/reservation-tabs'
import { adminReservationQueryKeys } from '../query-keys'

function getNextTabAfterClose(tab: ReservationTabId): ReservationTabId | null {
  if (tab === 'issue' || tab === 'return_check') return 'done'
  return null
}

export function useCloseReservationMutation(currentTab: ReservationTabId) {
  return useOptimisticTabMutation<
    ReservationTabId,
    AdminBookingItem,
    CloseReservationPayload,
    { success: true }
  >({
    mutationFn: closeReservation,

    currentTab,

    listQueryKey: tab => adminReservationQueryKeys.list(tab),
    countsQueryKey: adminReservationQueryKeys.counts(),

    getPayloadId: payload => payload.reservationId,
    getItemId: item => item.reservationId,

    getNextTab: (_payload, tab) => getNextTabAfterClose(tab),

    getInvalidateTabs: (_payload, tab) => {
      const nextTab = getNextTabAfterClose(tab)
      return nextTab ? [nextTab] : []
    },

    onSuccessSideEffect: () => {
      toast.success('완료 처리 완료')
    },

    onErrorSideEffect: () => {
      toast.error('완료 처리 실패')
    },
  })
}
