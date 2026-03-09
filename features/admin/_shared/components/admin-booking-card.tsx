'use client'

import { useRouter } from 'next/navigation'
import { AdminBookingItem } from '../types/admin-booking-item'
import { getTimeAgo } from '@/lib/time'
import { useState } from 'react'
import { cn, copyToClipboard } from '@/lib/utils'
import { Check } from 'lucide-react'
import { ADMIN_ACTION_UI_MAP } from '../status/admin-action-ui'
import {
  AdminAction,
  AdminDomainState,
  getAvailableActions,
  getBadge,
} from '../model/admin-state-machine'
import { UserInformation } from './user-information'
import { ReservationPeriod } from './reservation-period'

type Props = {
  item: AdminBookingItem
  onAction: (action: AdminAction, item: AdminBookingItem) => void
}

export function AdminBookingCard({ item, onAction }: Props) {
  const domainState = {
    reservationStatus: item.reservationStatus,
    usageStatus: item.usageStatus,
    vehicle: item.vehicle,
  } as AdminDomainState

  const router = useRouter()

  const badge = getBadge(domainState)
  const actions = getAvailableActions(domainState)

  const timeAgo = getTimeAgo(item.createdAt)

  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const origin = window.location.origin
    const link = `${origin}/reserve/${item.publicCode}`
    const success = await copyToClipboard(link)
    if (success) {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div
      className={cn(
        'bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-4 transition-all hover:shadow-md',
      )}
      onClick={() => router.push(`/admin/reservations/${item.reservationId}`)}
    >
      {/* 상단 */}
      <div className="relative flex justify-between items-start">
        <div className="flex gap-2">
          <span className={cn('px-3 py-1 text-[10px] font-black rounded-full', badge.className)}>
            {badge.label}
          </span>

          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-black rounded-full italic"
          >
            {isCopied ? (
              <>
                <Check size={12} className="inline text-green-500" /> 복사됨
              </>
            ) : (
              <># - {item.publicCode}</>
            )}
          </button>
        </div>

        <p className="text-[10px] text-gray-300">{timeAgo}</p>
      </div>

      {/* 사용자  / 차량 */}
      <div className="flex justify-between">
        <UserInformation item={item} />
        {item.vehicle && (
          <div className="flex flex-col items-center justify-center text-xs text-slate-600">
            <div>{item.vehicle.name}</div>
            <div>({item.vehicle.plateNumber})</div>
          </div>
        )}
      </div>

      {/* 일정 */}
      <ReservationPeriod item={item} />

      {/* 목적 */}
      <div className="bg-slate-50 rounded-2xl p-4">
        {item.reservationStatus === 'cancelled' && (
          <>
            <p className="text-[10px] font-black text-slate-400 mb-2">취소 사유</p>
            <p className="text-sm font-bold">{item.cancelReason ?? '사유 없음'}</p>
          </>
        )}
        {item.usageStatus === 'no_show' && (
          <>
            <p className="text-[10px] font-black text-slate-400 mb-2">이슈 내용</p>
            <p className="text-sm font-bold">{`${getTimeAgo(item.noShowReportedAt!)} 노쇼 처리 되었음`}</p>
          </>
        )}
        {!(item.reservationStatus == 'cancelled' || item.usageStatus === 'no_show') && (
          <>
            <p className="text-[10px] font-black text-slate-400 mb-2">방문 목적 (목적지)</p>
            <p className="text-sm font-bold">
              {item.purpose} ({item.destination})
            </p>
          </>
        )}
      </div>

      {/* 액션 */}
      {actions.length > 0 && (
        <div className="flex gap-2 pt-2">
          {actions.map(actionKey => {
            const ui = ADMIN_ACTION_UI_MAP[actionKey]

            return (
              <button
                key={actionKey}
                onClick={e => {
                  e.stopPropagation()
                  onAction(actionKey, item)
                }}
                className={cn(
                  'flex-1 py-4 rounded-2xl font-bold text-sm transition-transform active:scale-95',
                  ui.className,
                )}
              >
                {ui.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
