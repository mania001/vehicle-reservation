import { useState } from 'react'
import { AvailableVehicle } from '../../vehicles/types/availabe-vehicles'
import { Car, ChevronDown, Fuel } from 'lucide-react'
import Link from 'next/link'

type Props = {
  vehicle: AvailableVehicle
  selected: boolean
  onSelect: () => void
}

function formatDateRange(startAt: string, endAt: string) {
  const s = new Date(startAt)
  const e = new Date(endAt)

  return `${s.getMonth() + 1}/${s.getDate()} ${String(s.getHours()).padStart(2, '0')}:${String(
    s.getMinutes(),
  ).padStart(2, '0')} ~ ${e.getMonth() + 1}/${e.getDate()} ${String(e.getHours()).padStart(
    2,
    '0',
  )}:${String(e.getMinutes()).padStart(2, '0')}`
}

function statusLabel(status: string) {
  switch (status) {
    case 'returned':
      return '반납 완료'
    case 'checked_out':
      return '운행 중'
    case 'scheduled':
      return '예약됨'
    case 'no_show':
      return '노쇼'
    case 'cancelled':
      return '취소'
    default:
      return status
  }
}
export function VehicleSelectItem({ vehicle, selected, onSelect }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`relative w-full rounded-xl border py-2 text-left transition ${
        selected ? 'border-primary bg-primary/10' : 'border-border bg-white'
      }`}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        {/* 전체 클릭 = 선택 */}
        <button type="button" onClick={onSelect} className="flex-1 text-left">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm text-slate-300">
              <Car className="w-12 h-12" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">
                {vehicle.name} ({vehicle.plateNumber})
              </p>
              <div className="flex gap-3 mt-1">
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Fuel size={10} /> {vehicle.fuelLevel}
                </span>
                <span className="text-[10px] font-bold text-blue-500 uppercase">
                  {vehicle.fuelType}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                최근 사용:{' '}
                {vehicle.lastUsedAt ? new Date(vehicle.lastUsedAt).toLocaleString() : '기록 없음'}
              </p>
            </div>
          </div>
        </button>

        {/* chevron만 toggle */}
        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          className="p-2 rounded-lg hover:bg-muted border"
        >
          <ChevronDown className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {selected && (
          <span className="absolute top-2 -left-1 rounded-full bg-primary px-2 py-1 text-xs font-semibold text-white">
            선택됨
          </span>
        )}
      </div>

      {/* Accordion */}
      {open && (
        <div className="border-t px-4 py-3">
          <p className="mb-2 text-xs font-semibold text-gray-500">최근 사용 히스토리</p>

          {vehicle.history.length === 0 ? (
            <p className="text-sm text-gray-400">최근 사용 기록 없음</p>
          ) : (
            <div className="flex flex-col gap-2">
              {vehicle.history.map(h => (
                <div
                  key={h.usageId}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{formatDateRange(h.startAt, h.endAt)}</p>
                    <p className="text-xs text-gray-500">{statusLabel(h.status)}</p>
                  </div>

                  {h.reservationId && (
                    <Link
                      href={`/admin/reservations/${h.reservationId}`}
                      className="text-xs font-semibold text-primary"
                    >
                      예약 보기
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex justify-end">
            <Link
              href={`/admin/vehicles/${vehicle.id}`}
              className="text-sm font-semibold text-primary"
            >
              전체 히스토리 보기 →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
