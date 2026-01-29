'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from '@/components/ui/drawer'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { format, isBefore, setHours, setMinutes, startOfToday } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Clock } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface MobileDateTimePickerProps {
  label: string
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  minDate?: Date // 선택 가능한 최소 날짜
  variant?: 'start' | 'end'
}

export const MobileDateTimePicker = ({
  label,
  value,
  onChange,
  minDate,
  variant = 'start',
}: MobileDateTimePickerProps) => {
  // 오늘 날짜 기준 (과거 선택 방지용)
  const today = startOfToday()
  const scrollRef = useRef<HTMLDivElement>(null) // 시간 버튼들을 감싸는 Ref

  const scrollIntoView = () => {
    // 약간의 지연을 주어 Drawer 애니메이션이 끝난 후 실행되도록 함
    setTimeout(() => {
      if (scrollRef.current) {
        const selectedButton = scrollRef.current.querySelector('[data-selected="true"]')
        if (selectedButton) {
          selectedButton.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
          })
        }
      }
    }, 100) // 100ms 정도면 애니메이션 타이밍과 잘 맞습니다.
  }

  // [핵심 1] 선택된 시간이 보이지 않을 때 자동으로 스크롤 이동
  useEffect(() => {
    if (value) scrollIntoView()
  }, [value]) // value가 바뀔 때(Drawer가 열릴 때 포함) 실행

  // [핵심 2] 업데이트 헬퍼: 값이 없으면 현재 시간/분 기준으로 생성
  const updateTime = (h: number, m: number) => {
    const now = new Date()
    const baseDate = value || now
    const updated = setMinutes(setHours(baseDate, h), m)
    onChange(updated)
  }

  // 현재 렌더링용 시간/분 (값이 없으면 현재 시간 기준)
  const displayDate = value || new Date()
  const currentHour = displayDate?.getHours() ?? 9
  const currentMinute = Math.floor(displayDate.getMinutes() / 10) * 10 // 10분 단위 반올림

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-400 ml-1">{label}</label>

      <Drawer
        onOpenChange={open => {
          if (open) {
            scrollIntoView() // 열릴 때 자동 스크롤 실행
          }
        }}
      >
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full h-14 px-4 bg-slate-50 border-none rounded-2xl justify-start font-normal shadow-sm',
              !value && 'text-muted-foreground',
            )}
            // Drawer 열릴 때 값이 없으면 현재 시간으로 즉시 업데이트하고 싶다면 아래 주석 해제
            onClick={() => !value && onChange(new Date())}
          >
            <Clock
              className={cn(
                'mr-3 h-4 w-4',
                variant === 'start' ? 'text-blue-600' : 'text-rose-500',
              )}
            />
            {value ? (
              <span className="text-slate-700 font-medium text-base">
                {format(value, 'yyyy. MM. dd. (eee) HH:mm', { locale: ko })}
              </span>
            ) : (
              <span className="text-slate-400">일시를 선택해 주세요</span>
            )}
          </Button>
        </DrawerTrigger>

        {/* 1. h-[90dvh]: 화면 높이의 90%로 고정 (또는 적절한 픽셀값 h-[600px])
          2. max-h-[90dvh]: 너무 커지지 않게 제한
          3. flex flex-col: 내부 요소 정렬을 위해 필요
        */}
        <DrawerContent className="h-[90dvh] px-6 bg-white border-none outline-none flex flex-col">
          <div className="mx-auto w-full max-w-sm flex flex-col h-full">
            <DrawerHeader className="px-0 pt-6 pb-2 shrink-0">
              <DrawerTitle className="text-center text-lg font-bold text-slate-800">
                {label} 선택
              </DrawerTitle>
              {/* Description 워닝 해결! (스크린 리더용 또는 안내 문구) */}
              <DrawerDescription className="text-center text-xs text-slate-400">
                예약하고자 하는 날짜와 상세 시간을 설정하세요.
              </DrawerDescription>
            </DrawerHeader>

            {/* 컨텐츠 영역에 flex-1과 overflow-y-auto를 주어 
              달력 높이가 변해도 전체 Drawer 높이는 유지되게 합니다. 
            */}
            <div className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-8">
              {/* 날짜 선택 섹션 */}
              <Calendar
                mode="single"
                selected={value}
                onSelect={date => {
                  if (!date) return // 선택 취소 방지

                  // 날짜 바꿀 때 현재 화면에 표시된 시간 유지
                  onChange(setMinutes(setHours(date, currentHour), currentMinute))
                }}
                disabled={
                  date => isBefore(date, minDate || today) // 최소 날짜(오늘 또는 시작일) 이전은 비활성화
                }
                locale={ko}
                className="w-full mt-1"
              />

              {/* 2. 시간(시) 선택 - 가로 스크롤 방식 */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-800 ml-1  underline-offset-4 decoration-blue-200">
                  시간 선택
                </label>
                <ScrollArea className="w-full whitespace-nowrap mt-2">
                  <div className="flex gap-2 pb-3" ref={scrollRef}>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <Button
                        key={i}
                        variant={currentHour === i ? 'default' : 'outline'}
                        data-selected={currentHour === i}
                        className={cn(
                          'h-12 w-16 shrink-0 rounded-xl text-lg font-bold',
                          currentHour === i
                            ? 'bg-primary text-white'
                            : 'bg-white border-slate-100 text-slate-400',
                        )}
                        onClick={() => updateTime(i, currentMinute)}
                      >
                        {i.toString().padStart(2, '0')}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>

              {/* 3. 분 선택 - 고정 그리드 방식 */}
              <div className="space-y-3 pb-4">
                <label className="text-sm font-bold text-slate-800 ml-1 underline-offset-4 decoration-blue-200">
                  분 선택
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['00', '10', '20', '30', '40', '50'].map(m => {
                    const minuteNum = parseInt(m, 10)
                    return (
                      <Button
                        key={m}
                        variant={currentMinute === minuteNum ? 'default' : 'outline'}
                        className={cn(
                          'h-12 rounded-xl text-lg font-bold',
                          currentMinute === minuteNum
                            ? 'bg-primary text-white'
                            : 'bg-white border-slate-100 text-slate-400',
                        )}
                        onClick={() => updateTime(currentHour, minuteNum)}
                      >
                        {m}분
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="flex gap-3 pt-4 pb-8 shrink-0 border-t border-slate-50">
              <DrawerClose asChild>
                <Button className="w-full h-16 bg-primary hover:bg-primary-hover text-white rounded-2xl text-lg font-bold shadow-xl shadow-slate-200">
                  선택 완료
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
