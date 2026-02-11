import { AvailableVehicle } from '../types/availabe-vehicles'

export async function getAvailableVehicles(params: {
  startAt: string
  endAt: string
}): Promise<AvailableVehicle[]> {
  const qs = new URLSearchParams({
    startAt: params.startAt,
    endAt: params.endAt,
  })

  const res = await fetch(`/api/admin/vehicles/available?${qs.toString()}`, {
    method: 'GET',
    cache: 'no-store',
  })

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.error ?? '차량 목록 조회 실패')
  }

  return json.items as AvailableVehicle[]
}
