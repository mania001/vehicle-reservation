'use client'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { VehicleSelectItem } from '../../reservations/components/vehicle-select-item'
import { Button } from '@/components/ui/button'
import { AdminBookingItem } from '../../_shared/types/admin-booking-item'
import { useState } from 'react'
import { UserInformation } from '../../_shared/components/user-information'
import { ReservationPeriod } from '../../_shared/components/reservation-period'

export function CheckOutBottomDrawer({
  reservation,
  open,
  onOpenChange,
  onConfirm,
}: {
  reservation: AdminBookingItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
}) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] px-4 pb-8">
        <DrawerHeader>
          <DrawerTitle>키 배출 확인</DrawerTitle>
          <DrawerDescription>
            {reservation.requesterName}님께 키를 전달하셨나요? 확정 버튼을 눌러주세요.
          </DrawerDescription>
        </DrawerHeader>

        <div className="pb-4 space-y-3 overflow-y-auto mt-4">
          <UserInformation item={reservation} />

          {/* 일정 */}
          <ReservationPeriod item={reservation} />

          <div className="mt-4">
            <VehicleSelectItem
              vehicle={reservation.vehicle!}
              selected={true}
              onSelect={() => {}}
              picked
            />
          </div>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          키배출 시각은 현재 시간으로 자동 저장됩니다.
        </div>

        <DrawerFooter className="flex w-full flex-row justify-between gap-2 px-0 mt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>

          <Button
            type="button"
            className="flex-1 font-bold"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? '처리중...' : '키 배출 확정'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
