'use client'

import { WheelPicker } from './wheel-picker'

interface Props {
  date?: Date
  onChange: (date: Date) => void
  active: boolean
}

export const TimeWheelPicker = ({ date, onChange, active }: Props) => {
  const current = date ?? new Date()

  const hour = current.getHours()
  const minute = Math.floor(current.getMinutes() / 10) * 10

  const update = (h: number, m: number) => {
    const newDate = new Date(current)
    newDate.setHours(h)
    newDate.setMinutes(m)
    onChange(newDate)
  }

  return (
    <div className="flex gap-4">
      {/* 시 */}
      <WheelPicker
        items={Array.from({ length: 24 }, (_, i) => i)}
        value={hour}
        onChange={h => update(h, minute)}
        unit="시"
        active={active}
      />

      {/* 분 */}
      <WheelPicker
        items={[0, 10, 20, 30, 40, 50]}
        value={minute}
        onChange={m => update(hour, m)}
        unit="분"
        active={active}
      />
    </div>
  )
}
