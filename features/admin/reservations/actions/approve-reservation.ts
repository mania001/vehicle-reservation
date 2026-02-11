export async function approveReservation(input: {
  reservationId: string
  vehicleId?: string | null
}) {
  const res = await fetch('/api/admin/reservations/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    throw new Error('승인 처리 실패')
  }

  return res.json() as Promise<{ success: boolean }>
}
