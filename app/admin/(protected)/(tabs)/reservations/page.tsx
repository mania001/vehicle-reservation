import { ReservationView } from '@/features/admin/reservations/components/reservation-view'
import { DEFAULT_RESERVATION_TAB } from '@/features/admin/reservations/constants/reservation-tabs'
import { getReservations } from '@/features/admin/reservations/queries/get-reservations'

export default async function AdminReservationsPage() {
  const initialPending = await getReservations(DEFAULT_RESERVATION_TAB)
  return (
    <div className="relative">
      <ReservationView initialTab={DEFAULT_RESERVATION_TAB} initialData={initialPending} />
    </div>
  )
}
