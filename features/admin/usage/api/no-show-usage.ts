export type NoShowUsagePayload = {
  usageSessionId: string
}
export type NoShowUsageResponse = {
  success: true
}

export async function noShowUsage(payload: NoShowUsagePayload) {
  const res = await fetch(`/api/admin/usage/${payload.usageSessionId}/no-show`, {
    method: 'POST',
  })

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { message?: string } | null
    throw new Error(data?.message ?? '노쇼처리 실패')
  }

  return (await res.json()) as NoShowUsageResponse
}
