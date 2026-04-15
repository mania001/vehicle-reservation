'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
  DrawerDescription,
} from '@/components/ui/drawer'
import { cn } from '@/lib/utils'
import { format, isBefore, startOfDay, startOfToday } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Clock } from 'lucide-react'
import { useState } from 'react'
import { TimeWheelPicker } from './time-wheel-picker'

export type DateRangeValue = {
  startAt: Date | null
  endAt: Date | null
}

interface Props {
  label: string
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
}
type Step = 0 | 1 | 2 | 3

export const RangeDateTimePicker = ({ label, value, onChange }: Props) => {
  const [open, setOpen] = useState(false)

  // ✅ 방어 코드
  const safeValue = value ?? { startAt: null, endAt: null }

  // 🔥 UI용 내부 상태 (확정 전까지 유지)
  const [draft, setDraft] = useState<DateRangeValue>(safeValue)
  const [step, setStep] = useState<Step>(0)

  const isComplete = draft.startAt && draft.endAt

  const today = startOfToday()

  const handleOpenChange = (o: boolean) => {
    setOpen(o)
    if (o) {
      setDraft(value) // 🔥 열릴 때 동기화
      setStep(0)
    }
  }

  const handleConfirm = () => {
    if (!isComplete) return
    onChange(draft) // 🔥 최종 반영
  }

  return (
    <div className="space-y-1.5 px-0.5">
      {/* <label className="text-xs font-semibold text-slate-400 ml-1">{label}</label> */}

      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              ' relative group w-full h-14 px-4 bg-slate-50 border-none rounded-2xl justify-start text-base shadow-sm',
              !value.startAt && 'text-muted-foreground',
            )}
            onClick={e => {
              e.currentTarget.blur() // ✅ 핵심
            }}
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="pl-7">
              {value.startAt && value.endAt
                ? `${format(value.startAt, 'yy.MM.dd HH:mm')} ~ ${format(value.endAt, 'MM.dd HH:mm')}`
                : '예약 일시를 선택해 주세요'}
            </div>
          </Button>
        </DrawerTrigger>

        <DrawerContent
          className="h-[90dvh] px-6 bg-white border-none outline-none flex flex-col"
          onOpenAutoFocus={e => {
            e.preventDefault() // 기본 focus 이동 막고
          }}
        >
          <div className="mx-auto w-full max-w-sm flex flex-col h-full">
            <DrawerHeader>
              <DrawerTitle className="text-center text-lg font-bold">
                {label} 선택 ({step + 1}/4)
              </DrawerTitle>
              <DrawerDescription className="text-center text-xs text-slate-400">
                예약하고자 하는 날짜와 상세 시간을 설정하세요.
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-8">
              {/* 1. 시작 날짜 */}
              {step === 0 && (
                <Calendar
                  mode="single"
                  selected={draft.startAt ?? undefined}
                  onSelect={date => {
                    if (!date) return
                    setDraft(prev => ({
                      ...prev,
                      startAt: date,
                    }))
                    // setStep(1)
                  }}
                  disabled={date => isBefore(date, today)}
                  locale={ko}
                  className="w-full mt-1"
                />
              )}

              {/* 2. 시작 시간 */}
              {step === 1 && draft.startAt && (
                <div className="mt-10">
                  <TimeWheelPicker
                    date={draft.startAt}
                    onChange={date => {
                      setDraft(prev => ({
                        ...prev,
                        startAt: date,
                      }))
                    }}
                    active={step === 1}
                  />
                </div>
              )}

              {/* 3. 종료 날짜 */}
              {step === 2 && (
                <Calendar
                  mode="single"
                  selected={draft.endAt ?? undefined}
                  onSelect={date => {
                    if (!date) return
                    setDraft(prev => ({
                      ...prev,
                      endAt: date,
                    }))
                    // setStep(3)
                  }}
                  disabled={date => {
                    if (!draft.startAt) return isBefore(date, today)

                    const start = startOfDay(draft.startAt)
                    const target = startOfDay(date)

                    return target < start
                    // if (!draft.startAt) return false
                    // return date < new Date(draft.startAt.setHours(0, 0, 0, 0))
                  }}
                  locale={ko}
                  className="w-full mt-1"
                />
              )}

              {/* 4. 종료 시간 */}
              {step === 3 && draft.endAt && (
                <div className="mt-10">
                  <TimeWheelPicker
                    date={draft.endAt}
                    onChange={date => {
                      if (draft.startAt && date < draft.startAt) return
                      setDraft(prev => ({
                        ...prev,
                        endAt: date,
                      }))
                    }}
                    active={step === 3}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 pb-8 border-t border-slate-50">
              {step > 0 && (
                <Button
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl"
                  onClick={() => setStep(prev => (prev - 1) as Step)}
                >
                  이전
                </Button>
              )}

              {step < 3 && (
                <Button
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl"
                  onClick={() => setStep(prev => (prev + 1) as Step)}
                >
                  다음
                </Button>
              )}

              {step === 3 && (
                <DrawerClose asChild>
                  <Button
                    disabled={!isComplete}
                    onClick={handleConfirm}
                    className="flex-1 h-14 rounded-2xl text-lg font-bold"
                  >
                    선택 완료
                  </Button>
                </DrawerClose>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
