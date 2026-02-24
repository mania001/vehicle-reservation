'use client'

import { useState } from 'react'
import { AdminAction } from '../../_shared/actions/admin-actions'
import { AdminBookingItem } from '../../_shared/types/admin-booking-item'
import { ReservationTabId } from '../constants/reservation-tabs'
import { useApproveReservationMutation } from '../mutations/use-approve-reservation-mutation'
import { useRejectReservationMutation } from '../mutations/use-reject-reservation-mutation'
import { canExecuteReservationAction } from '../state-machine'
import { toast } from 'sonner'
import { ApproveBottomDrawer } from './approve-bottom-drawer'
import { RejectBottomDrawer } from './reject-bottom-drawer'

type Props = {
  action: AdminAction | null
  item: AdminBookingItem | null
  clear: () => void
  currentTab: ReservationTabId
}

export function ReservationActionDispatcher({ action, item, clear, currentTab }: Props) {
  const [drawer, setDrawer] = useState<AdminAction | null>(null)

  const approveMutation = useApproveReservationMutation(currentTab)
  const rejectMutation = useRejectReservationMutation(currentTab)

  if (!action || !item) return null

  // 🔥 1차 상태 검증
  if (!canExecuteReservationAction(item, action)) {
    toast.error('현재 상태에서 실행할 수 없는 작업입니다.')
    clear()
    return null
  }

  // Drawer 필요한 액션 분리
  if (action === 'approve' || action === 'reject') {
    if (drawer !== action) {
      setDrawer(action)
    }
  }

  return (
    <>
      {drawer === 'approve' && (
        <ApproveBottomDrawer
          open
          onOpenChange={() => {
            setDrawer(null)
            clear()
          }}
          startAt={item.startAt}
          endAt={item.endAt}
          onConfirm={async vehicleId => {
            await approveMutation.mutateAsync({
              reservationId: item.reservationId,
              vehicleId,
            })
            setDrawer(null)
            clear()
          }}
        />
      )}

      {drawer === 'reject' && (
        <RejectBottomDrawer
          open
          onOpenChange={() => {
            setDrawer(null)
            clear()
          }}
          onConfirm={async reason => {
            await rejectMutation.mutateAsync({
              reservationId: item.reservationId,
              reason,
            })
            setDrawer(null)
            clear()
          }}
        />
      )}
    </>
  )
}
