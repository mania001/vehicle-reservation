export type ApproveReservationPayload = {
  reservationId: string
  vehicleId: string | null
}

export type ApproveReservationResponse = {
  success: true
}

export async function approveReservation(payload: ApproveReservationPayload) {
  const res = await fetch('/api/admin/reservations/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { message?: string } | null
    throw new Error(data?.message ?? '승인 처리 실패')
  }

  return (await res.json()) as ApproveReservationResponse
}
