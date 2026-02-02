import { ReservationStatus } from '@/domains/reservation/reservation-status'

interface Props {
  status: ReservationStatus
}

export function ReservationStatusView({ status }: Props) {
  switch (status) {
    case 'pending':
      return (
        <StatusBox
          title="예약 접수 완료"
          description="예약이 접수되었습니다. 담당자가 확인 후 승인합니다."
          tone="info"
        />
      )

    case 'approved':
      return (
        <StatusBox
          title="예약 승인 완료"
          description="예약이 승인되었습니다. 사용 당일 안내에 따라 진행해주세요."
          tone="success"
        />
      )

    case 'rejected':
      return (
        <StatusBox
          title="예약이 거절되었습니다"
          description="예약이 승인되지 않았습니다. 필요 시 관리자에게 문의해주세요."
          tone="error"
        />
      )

    case 'cancelled':
      return (
        <StatusBox
          title="예약이 취소되었습니다"
          description="해당 예약은 취소 처리되었습니다."
          tone="neutral"
        />
      )
  }
}

function StatusBox({
  title,
  description,
  tone,
}: {
  title: string
  description: string
  tone: 'info' | 'success' | 'error' | 'neutral'
}) {
  const toneMap = {
    info: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    error: 'bg-rose-50 text-rose-700',
    neutral: 'bg-slate-50 text-slate-600',
  }

  return (
    <div className={`rounded-2xl p-4 ${toneMap[tone]}`}>
      <h2 className="font-bold">{title}</h2>
      <p className="text-sm mt-1">{description}</p>
    </div>
  )
}
