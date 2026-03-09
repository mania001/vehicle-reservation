export type CloseReservationPayload = {
  reservationId: string
}

export type CloseReservationResponse = {
  success: true
}

export async function closeReservation(payload: CloseReservationPayload) {
  const res = await fetch(`/api/admin/reservations/${payload.reservationId}/close`, {
    method: 'POST',
  })

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { message?: string } | null
    throw new Error(data?.message ?? '이슈 처리 실패')
  }

  return (await res.json()) as CloseReservationResponse
}
