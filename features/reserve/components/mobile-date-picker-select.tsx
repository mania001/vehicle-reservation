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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { format, isBefore, setHours, setMinutes, startOfToday } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Clock } from 'lucide-react'

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

  // 시간과 분을 변경하는 핸들러
  const handleTimeChange = (type: 'hour' | 'minute', timeValue: string) => {
    if (!value) return
    const numValue = parseInt(timeValue, 10)
    const updatedDate = type === 'hour' ? setHours(value, numValue) : setMinutes(value, numValue)
    onChange(updatedDate)
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-400 ml-1">{label}</label>

      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full h-14 px-4 bg-slate-50 border-none rounded-2xl justify-start font-normal focus:ring-2 focus:ring-blue-600/20 shadow-sm transition-all',
              !value && 'text-muted-foreground',
            )}
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
        <DrawerContent className="h-[85dvh] px-6 bg-white border-none outline-none flex flex-col">
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
            <div className="flex-1 overflow-y-auto no-scrollbar py-4">
              {/* 날짜 선택 섹션 */}
              <div className="bg-slate-50 rounded-[2.5rem] p-4 flex justify-center">
                <Calendar
                  mode="single"
                  selected={value}
                  onSelect={date => {
                    if (date) {
                      // 날짜를 바꿀 때 기존 시간 정보를 유지함
                      const currentHours = value?.getHours() || 9
                      const currentMinutes = value?.getMinutes() || 0
                      onChange(setMinutes(setHours(date, currentHours), currentMinutes))
                    }
                  }}
                  disabled={
                    date => isBefore(date, minDate || today) // 최소 날짜(오늘 또는 시작일) 이전은 비활성화
                  }
                  locale={ko}
                  className="w-full flex justify-center"
                />
              </div>

              {/* 시간 선택 섹션 (휠 피커 대신 모바일에서 조작이 쉬운 Select 구성) */}
              <div className="flex items-center justify-center gap-4 py-6">
                <div className="flex items-center gap-2">
                  <Select
                    value={value?.getHours().toString()}
                    onValueChange={v => handleTimeChange('hour', v)}
                  >
                    <SelectTrigger className="w-20 h-12 bg-slate-50 border-none rounded-xl font-bold text-lg">
                      <SelectValue placeholder="시" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, '0')}시
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span className="font-bold text-slate-400">:</span>

                  <Select
                    value={value?.getMinutes().toString()}
                    onValueChange={v => handleTimeChange('minute', v)}
                  >
                    <SelectTrigger className="w-20 h-12 bg-slate-50 border-none rounded-xl font-bold text-lg">
                      <SelectValue placeholder="분" />
                    </SelectTrigger>
                    <SelectContent>
                      {['00', '10', '20', '30', '40', '50'].map(m => (
                        <SelectItem key={m} value={m}>
                          {m}분
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 하단 버튼 영역 - 하단에 딱 붙어있도록 shrink-0 설정 */}
            <div className="flex gap-3 pt-4 pb-8 shrink-0">
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  className="flex-1 h-14 rounded-2xl font-semibold text-slate-500"
                >
                  취소
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-100">
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
