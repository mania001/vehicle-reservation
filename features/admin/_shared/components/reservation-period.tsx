import { Calendar } from 'lucide-react'
import { AdminBookingItem } from '../types/admin-booking-item'
import { getReservationPeriod } from '@/lib/time'

type Props = {
  item: AdminBookingItem
}

export function ReservationPeriod({ item }: Props) {
  const { range, duration } = getReservationPeriod(item.startAt, item.endAt)

  return (
    <div className="text-xs text-center text-slate-500">
      <Calendar size={12} className="inline mr-1" />
      {range} ({duration})
    </div>
  )
}
