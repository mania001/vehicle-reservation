'use client'

import { useRouter } from 'next/navigation'
import { AdminBookingItem } from '../types/admin-booking-item'
import { resolveAdminDisplayStatus } from '../status/resolve-admin-display-status'
import { ADMIN_ACTION_MAP, ADMIN_BADGE_MAP } from '../status/admin-status-ui'
import { getReservationPeriod, getTimeAgo } from '@/lib/time'
import { useState } from 'react'
import { cn, copyToClipboard, formatPhoneNumber } from '@/lib/utils'
import { Calendar, Check, PhoneCall, User } from 'lucide-react'
import { AdminAction } from '../actions/admin-actions'
import { ADMIN_ACTION_UI_MAP } from '../status/admin-action-ui'

type Props = {
  item: AdminBookingItem
  onAction: (action: AdminAction, item: AdminBookingItem) => void
}

export function AdminBookingCard({ item, onAction }: Props) {
  const router = useRouter()

  const displayStatus = resolveAdminDisplayStatus({
    reservationStatus: item.reservationStatus,
    usageStatus: item.usageStatus,
  })

  console.log(item.reservationStatus, item.usageStatus, displayStatus)

  const badge = ADMIN_BADGE_MAP[displayStatus]
  const actions = ADMIN_ACTION_MAP[displayStatus]

  const timeAgo = getTimeAgo(item.createdAt)
  const { range, duration } = getReservationPeriod(item.startAt, item.endAt)

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
      className="bg-white border rounded-2xl p-4 shadow-sm space-y-4 cursor-pointer"
      onClick={() => router.push(`/admin/reservations/${item.reservationId}`)}
    >
      {/* 상단 */}
      <div className="flex justify-between items-start">
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

      {/* 사용자 */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
          <User size={24} className="text-gray-400" />
        </div>

        <div>
          <h3 className="font-bold">
            {item.requesterName}{' '}
            <span className="text-xs text-muted-foreground">{item.organization}</span>
          </h3>

          <a
            href={`tel:${item.requesterPhone}`}
            onClick={e => e.stopPropagation()}
            className="text-sm text-muted-foreground flex items-center gap-2"
          >
            <PhoneCall size={12} /> {formatPhoneNumber(item.requesterPhone)}
          </a>
        </div>
      </div>

      {/* 일정 */}
      <div className="text-xs text-center text-slate-500">
        <Calendar size={12} className="inline mr-1" />
        {range} ({duration})
      </div>

      {/* 목적 */}
      <div className="bg-slate-50 rounded-2xl p-4">
        <p className="text-[10px] font-black text-slate-400 mb-2">방문 목적 (목적지)</p>
        <p className="text-sm font-bold">
          {item.purpose} ({item.destination})
        </p>
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
                className={`
            flex-1 py-4 rounded-2xl font-bold text-sm
            ${ui.className}
          `}
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
