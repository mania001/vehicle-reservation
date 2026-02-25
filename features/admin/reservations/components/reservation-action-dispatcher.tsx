'use client'

import { useEffect, useState } from 'react'
import { AdminBookingItem } from '../../_shared/types/admin-booking-item'
import { ReservationTabId } from '../constants/reservation-tabs'
import { useApproveReservationMutation } from '../mutations/use-approve-reservation-mutation'
import { useRejectReservationMutation } from '../mutations/use-reject-reservation-mutation'
import { toast } from 'sonner'
import { ApproveBottomDrawer } from './approve-bottom-drawer'
import { RejectBottomDrawer } from './reject-bottom-drawer'
import { AdminAction, getTransition } from '../../_shared/model/admin-state-machine'

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

  // ✅ transition은 안전하게 계산
  const transition =
    action && item
      ? getTransition(
          {
            reservationStatus: item.reservationStatus,
            usageStatus: item.usageStatus,
          },
          action,
        )
      : null

  // ✅ Hook은 항상 호출된다 (조건문 안 아님)
  useEffect(() => {
    if (!action || !item) return

    if (!transition) {
      toast.error('현재 상태에서 실행할 수 없는 작업입니다.')
      clear()
      return
    }

    if (transition.requiresDrawer) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      setDrawer(action)
    } else {
      executeDirectAction(action)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action])

  async function executeDirectAction(action: AdminAction) {
    try {
      switch (action) {
        default:
          break
      }
    } finally {
      clear()
    }
  }

  if (!action || !item) return null

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
