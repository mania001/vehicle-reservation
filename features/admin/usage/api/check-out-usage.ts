export type CheckOutUsagePayload = {
  usageSessionId: string
}
export type CheckOutUsageResponse = {
  success: true
}

export async function checkOutUsage(payload: CheckOutUsagePayload) {
  const res = await fetch(`/api/admin/usage/${payload.usageSessionId}/check-out`, {
    method: 'POST',
  })

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { message?: string } | null
    throw new Error(data?.message ?? '키 배출 실패')
  }

  return (await res.json()) as CheckOutUsageResponse
}
