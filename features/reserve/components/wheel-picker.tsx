'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface WheelPickerProps {
  items: number[]
  value: number
  onChange: (v: number) => void
  unit?: string
  active: boolean
}

const ITEM_HEIGHT = 48 // h-12

export function WheelPicker({ items, value, onChange, unit, active }: WheelPickerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!active) return
    if (value === undefined || value === null) return
    if (initializedRef.current) return

    const index = items.indexOf(value)
    if (index < 0 || !ref.current) return

    const container = ref.current

    container.scrollTo({
      top: index * ITEM_HEIGHT, // ✅ 핵심 변경
      behavior: 'auto',
    })
  }, [active, value, items]) // items도 바뀔 수 있으니 추가

  // 🔥 active 꺼지면 초기화 (다음 진입 대비)
  useEffect(() => {
    if (!active) {
      initializedRef.current = false
    }
  }, [active])

  return (
    <div className="relative h-48 w-full overflow-hidden">
      {/* 선택 영역 */}
      <div className="absolute top-1/2 left-0 w-full h-12 -translate-y-1/2 border-y border-slate-200 z-10 pointer-events-none" />

      <div
        ref={ref}
        className="h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="py-18">
          {/* (h-48 - h-12) / 2 */}
          {items.map(item => {
            const selected = item === value

            return (
              <div
                key={item}
                onClick={() => onChange(item)}
                className={cn(
                  'h-12 flex items-center justify-center text-lg snap-center cursor-pointer transition-all',
                  selected ? 'text-primary font-bold scale-110' : 'text-slate-400 opacity-40',
                )}
              >
                {item.toString().padStart(2, '0')}
                {unit}
              </div>
            )
          })}
        </div>
      </div>

      {/* 위/아래 페이드 */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white via-transparent to-white" />
    </div>
  )
}
