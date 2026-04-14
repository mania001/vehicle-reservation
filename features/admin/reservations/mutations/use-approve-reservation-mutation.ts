'use client'

import { toast } from 'sonner'
import { useOptimisticTabMutation } from '../../_shared/mutations/use-optimistic-tab-mutation'
import { approveReservation, ApproveReservationPayload } from '../api/approve-reservatiton'
import { ReservationTabId } from '../constants/reservation-tabs'
import { adminReservationQueryKeys } from '../query-keys'
import { AdminReservationListItem } from '../types/reservaiton-list-item'
import { adminUsageQueryKeys } from '../../usage/query-keys'

function getNextTabAfterApprove(
  currentTab: ReservationTabId,
  payload?: ApproveReservationPayload,
): ReservationTabId | null {
  if (currentTab === 'pending') {
    if (payload?.vehicleId) {
      return null
    }

    return 'need_car'
  }

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

    getNextTab: (payload, tab) => getNextTabAfterApprove(tab, payload),

    getInvalidateTabs: (payload, tab) => {
      const nextTab = getNextTabAfterApprove(tab, payload)
      return nextTab ? [nextTab] : []
    },

    onSuccessSideEffect: (_result, payload) => {
      toast.success(payload.vehicleId ? '승인 + 배차 완료' : '승인 완료')
    },

    onErrorSideEffect: () => {
      toast.error('승인 처리 실패')
    },

    extraInvalidateKeys: payload => {
      if (payload.vehicleId) {
        return [
          adminUsageQueryKeys.list('key_out'), // 리스트 전체
          adminUsageQueryKeys.counts(), // 카운트
        ]
      }
      return []
    },
  })
}
