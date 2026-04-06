export const checkItemKeys = ['isReturnKey', 'isCleaned', 'isFuelReceiptTaken'] as const
export type CheckItemKey = (typeof checkItemKeys)[number]

export type SelectionState = Record<CheckItemKey, boolean | null>

export type InspectUsagePayload = {
  usageSessionId: string

  mileage: number
  fuelLevel: number
  parkingZone: string
  parkingNumber: string
  isCleaned: boolean
  issue?: boolean
  note?: string
  images: File[]
  selections?: SelectionState
}

export type InspectUsageResponse = {
  success: true
}

export async function inspectUsage(payload: InspectUsagePayload) {
  const formData = new FormData()

  formData.append('mileage', String(payload.mileage))
  formData.append('fuelLevel', String(payload.fuelLevel))
  formData.append('parkingZone', payload.parkingZone)
  formData.append('parkingNumber', payload.parkingNumber)
  formData.append('isCleaned', String(payload.isCleaned))
  formData.append('issue', String(payload.issue))
  formData.append('selections', JSON.stringify(payload.selections))

  if (payload.note) {
    formData.append('note', payload.note)
  }

  payload.images.forEach(file => {
    formData.append('images', file)
  })

  const res = await fetch(`/api/admin/usage/${payload.usageSessionId}/inspect`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)

    throw new Error(data?.message ?? '점검 처리 실패')
  }
  return (await res.json()) as InspectUsageResponse
}
