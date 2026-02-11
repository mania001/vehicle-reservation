'use client'

import { ReservationTabId } from '../constants/reservation-tabs'
import { AdminReservationListItem } from '../types/reservaiton-list-item'
import ReservationCard from './reservation-card'

type Props = {
  items: AdminReservationListItem[]
  emptyMessage: string
  currentTab: ReservationTabId
}

export default function ReservationList({ items, emptyMessage, currentTab }: Props) {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <p className="text-sm font-semibold text-slate-500">{emptyMessage}</p>
        <p className="text-xs text-slate-400 mt-2">현재 처리할 항목이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {items.map(item => (
        <ReservationCard key={item.reservationId} item={item} currentTab={currentTab} />
      ))}
    </div>
  )
}
