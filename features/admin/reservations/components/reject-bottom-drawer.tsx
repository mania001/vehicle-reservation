'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

type RejectDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => Promise<void>
}

const QUICK_REASONS = [
  '예약 정보가 부족합니다',
  '해당 시간에 차량 배정이 어렵습니다',
  '중복 예약이 확인되었습니다',
  '예약 목적이 정책에 맞지 않습니다',
  '담당자 확인이 필요합니다',
] as const

export function RejectBottomDrawer({
  open,
  onOpenChange,
  onConfirm,
  // reservationSummary,
}: RejectDrawerProps) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    const trimmed = reason.trim()

    if (trimmed.length < 2) {
      setError('반려 사유를 입력해주세요.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onConfirm(trimmed)
      setReason('')
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : '반려 처리 실패'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  function applyQuickReason(text: string) {
    setReason(prev => (prev ? `${prev}\n${text}` : text))
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] px-4 pb-8">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="shrink-0">
            <DrawerTitle className="text-base font-bold">예약 반려</DrawerTitle>
            <DrawerDescription>반려 사유를 선택하거나 직접 입력해주세요.</DrawerDescription>
          </DrawerHeader>

          {/* 퀵 사유 리스트 컨테이너 */}
          {/* 퀵 사유 리스트 */}
          <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">
            자주 쓰는 반려 사유
          </p>

          <div className="flex! flex-wrap! gap-3 w-full">
            {QUICK_REASONS.map(r => (
              <Badge
                key={r}
                variant={reason === r ? 'default' : 'outline'}
                className="shrink-0! inline-block mx-1 mb-1 cursor-pointer px-3 py-2 rounded-xl  text-[11px] font-bold transition-all border-slate-200 active:scale-95"
                onClick={() => applyQuickReason(r)}
              >
                {r}
              </Badge>
            ))}
          </div>

          {/* 사유 입력 필드 */}
          <p className="mt-2 text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">
            상세 사유 입력
          </p>

          <Textarea
            placeholder="상세한 반려 사유를 입력하세요..."
            className="min-h-30 rounded-2xl bg-slate-50 border-none  text-sm p-4"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />

          {error && <div className="mt-3 text-sm font-medium text-red-600">{error}</div>}

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
              {loading ? '처리중...' : '반려 확정'}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
