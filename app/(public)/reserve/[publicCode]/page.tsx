import { getReservationByPublicCode } from '@/domains/reservation/get-reservation-by-public-code'
import { ReservationSummary } from '@/features/reserve/components/reservation-summary'
import { ReservationStatusView } from '@/features/reserve/components/reservation-status-view'
import { notFound } from 'next/navigation'
import { ReservationTimeline } from '@/features/reserve/components/reservation-timeline'
import { mapToTimelineStatus } from '@/features/reserve/timeline/map-to-timeline'

interface PageProps {
  params: { publicCode: string }
}

export default async function ReserveDeatilPage({ params }: PageProps) {
  const { publicCode } = await params
  const reservation = await getReservationByPublicCode(publicCode)

  if (!reservation) {
    notFound()
  }

  const timelineStatus = mapToTimelineStatus(reservation.status)

  return (
    <div className="space-y-6 pb-16">
      {/* 타임라인 */}
      <div className="mt-4">
        <ReservationTimeline currentStatus={timelineStatus} />
      </div>

      <header className="py-6">
        <h1 className="text-xl font-bold text-slate-800">예약 상태 확인</h1>
        <p className="text-sm text-slate-400 mt-1">예약번호: {reservation.publicCode}</p>
      </header>

      <main className="flex-1 space-y-6">
        <ReservationStatusView status={reservation.status} />
        <ReservationSummary reservation={reservation} />
      </main>
    </div>
  )
}
