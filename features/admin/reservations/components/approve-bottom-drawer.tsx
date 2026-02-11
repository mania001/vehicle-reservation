import { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { useAvailableVehicles } from '../../vehicles/hooks/use-available-vehicles'
import { VehicleSelectItem } from './vehicle-select-item'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void

  reservationId: string
  startAt: string // ISO
  endAt: string // ISO

  onConfirm: (vehicleId: string | null) => Promise<void>
}

export function ApproveBottomDrawer({
  open,
  onOpenChange,
  // reservationId,
  startAt,
  endAt,
  onConfirm,
}: Props) {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { data: vehicles, isLoading } = useAvailableVehicles(startAt, endAt, open)

  async function handleConfirm() {
    setError(null)
    setLoading(true)

    try {
      await onConfirm(selectedVehicleId)
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : '승인 처리 실패'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] px-4 pb-8">
        <DrawerHeader>
          <DrawerTitle>예약 승인 / 배차</DrawerTitle>
          <DrawerDescription>
            예약 시간에 사용 가능한 차량만 추천 목록으로 표시됩니다.
          </DrawerDescription>
        </DrawerHeader>

        <div className="pb-4 space-y-3 overflow-y-auto">
          {isLoading && (
            <div className="text-sm text-muted-foreground">추천 차량 불러오는 중...</div>
          )}

          {!isLoading && vehicles && vehicles.length === 0 && (
            <div className="rounded-xl border bg-white p-4 text-sm text-muted-foreground">
              해당 시간에 사용 가능한 차량이 없습니다.
            </div>
          )}

          {vehicles?.map(v => (
            <VehicleSelectItem
              key={v.id}
              vehicle={v}
              selected={selectedVehicleId === v.id}
              onSelect={() => setSelectedVehicleId(prev => (prev === v.id ? null : v.id))}
            />
          ))}
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        <p className="mt-3 text-xs text-muted-foreground">
          * 차량을 선택하지 않고 승인할 수도 있습니다. (배차는 이후 가능)
        </p>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            취소
          </Button>

          <Button type="button" className="flex-1" onClick={handleConfirm} disabled={loading}>
            {loading ? '처리 중...' : '승인 완료'}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
