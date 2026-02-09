interface Props {
  params: { id: string }
}

export default async function ReservationDetailPage({ params }: Props) {
  const { id } = await params
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">예약 상세</h1>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="text-xs text-slate-400 font-semibold">Reservation ID</div>
        <div className="font-mono text-slate-800 mt-2">{id}</div>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 text-slate-600">
        여기에 승인/배차/취소/완료 처리 UI가 들어갈 예정
      </div>
    </div>
  )
}
