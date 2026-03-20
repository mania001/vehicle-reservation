'use client'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Textarea } from '@/components/ui/textarea'
import { Reservation } from '@/domains/reservation/reservation.types'
import { useState } from 'react'
import { cancelReservation } from '../actions/cancel-reservation'
import { useRouter } from 'next/navigation'

interface Props {
  reservation: Reservation
}

export function CancelBottomDrawer({ reservation }: Props) {
  const [open, setOpen] = useState(false)

  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  async function handleSubmit() {
    const trimmed = reason.trim()

    if (trimmed.length < 2) {
      setError('취소 사유를 입력해주세요.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await cancelReservation(reservation.id, trimmed)
      setReason('')
      setOpen(false)

      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : '취소 처리 실패'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className="flex-1 h-12 bg-gray-200 text-gray-500 shadow"
          onClick={e => {
            // setOpen(true)
            // 핵심: 클릭하는 순간 버튼의 포커스를 해제하여
            // aria-hidden이 걸린 영역 내에 포커스가 남지 않게 합니다.
            e.currentTarget.blur()
          }}
        >
          예약 취소
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh] w-full px-4">
        <div className="mx-auto w-full max-w-md flex flex-col h-full">
          <DrawerHeader>
            <DrawerTitle>예약 취소</DrawerTitle>
            <DrawerDescription>예약을 취소하는 이유를 입력해주세요.</DrawerDescription>
          </DrawerHeader>
          <div className="pb-4 space-y-3 overflow-y-auto p-1">
            {/* 사유 입력 필드 */}
            <p className="mt-2 text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">
              상세 사유 입력
            </p>

            <Textarea
              placeholder="상세한 취소 사유를 입력하세요..."
              className="min-h-30 rounded-2xl bg-slate-50 border-none  text-sm p-4"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />

            {error && <div className="mt-3 text-sm font-medium text-red-500">{error}</div>}
          </div>
          <DrawerFooter className="flex w-full flex-row justify-between gap-2 px-0 mt-2">
            <DrawerClose asChild>
              <Button type="button" variant="outline" className="flex-1 h-12" disabled={loading}>
                취소
              </Button>
            </DrawerClose>
            <Button className="flex-1  h-12" onClick={handleSubmit} disabled={loading}>
              {loading ? '기다리는 중...' : '예약 취소'}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
