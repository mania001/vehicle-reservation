export async function rejectReservation(reservationId: string) {
  const res = await fetch('/api/admin/reservations/reject', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reservationId }),
  })

  if (!res.ok) {
    throw new Error('반려 처리 실패')
  }

  return res.json() as Promise<{ success: boolean }>
}
