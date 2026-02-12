export type RejectReservationPayload = {
  reservationId: string
  reason: string
}

export async function rejectReservation(payload: RejectReservationPayload) {
  const res = await fetch('/api/admin/reservations/reject', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const json = (await res.json().catch(() => null)) as { message?: string } | null
    throw new Error(json?.message ?? '반려 처리 실패')
  }

  return res.json() as Promise<{ success: true }>
}
