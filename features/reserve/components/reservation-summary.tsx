import { Reservation } from '@/domains/reservation/reservation.types'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface Props {
  reservation: Reservation
}

export function ReservationSummary({ reservation }: Props) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4 space-y-3">
      <Row label="이름" value={reservation.requesterName} />
      <Row label="소속" value={reservation.organization} />
      <Row label="연락처" value={reservation.requesterPhone} />
      <Row
        label="사용 시간"
        value={`${format(reservation.startAt, 'yyyy.MM.dd HH:mm', {
          locale: ko,
        })} ~ ${format(reservation.endAt, 'MM.dd HH:mm', { locale: ko })}`}
      />
      <Row label="목적" value={reservation.purpose} />
      <Row label="목적지" value={reservation.destination} />
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-800 font-medium">{value}</span>
    </div>
  )
}
