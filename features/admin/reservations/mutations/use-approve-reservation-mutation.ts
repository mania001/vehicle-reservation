'use client'

import { toast } from 'sonner'
import { useOptimisticTabMutation } from '../../_shared/mutations/use-optimistic-tab-mutation'
import { approveReservation, ApproveReservationPayload } from '../api/approve-reservatiton'
import { ReservationTabId } from '../constants/reservation-tabs'
import { adminReservationQueryKeys } from '../query-keys'
import { AdminReservationListItem } from '../types/reservaiton-list-item'

function getNextTabAfterApprove(currentTab: ReservationTabId): ReservationTabId | null {
  if (currentTab === 'pending') return 'need_car'
  return null
}

export function useApproveReservationMutation(currentTab: ReservationTabId) {
  return useOptimisticTabMutation<
    ReservationTabId,
    AdminReservationListItem,
    ApproveReservationPayload,
    { success: true }
  >({
    mutationFn: approveReservation,

    currentTab,

    listQueryKey: tab => adminReservationQueryKeys.list(tab),
    countsQueryKey: adminReservationQueryKeys.counts(),

    getPayloadId: payload => payload.reservationId,
    getItemId: item => item.reservationId,

    getNextTab: (_payload, tab) => getNextTabAfterApprove(tab),

    getInvalidateTabs: (_payload, tab) => {
      const nextTab = getNextTabAfterApprove(tab)
      return nextTab ? [nextTab] : []
    },

    onSuccessSideEffect: (_result, payload) => {
      toast.success(payload.vehicleId ? '승인 + 배차 완료' : '승인 완료')
    },

    onErrorSideEffect: () => {
      toast.error('승인 처리 실패')
    },
  })
}
