import { UsageTabId } from '../constants/usage-tabs'

export type AdminUsageListItem = {
  reservationId: string
  usageSessionId: string | null

  publicCode: string

  requesterName: string
  requesterPhone: string
  organization: string

  purpose: string
  destination: string

  startAt: string
  endAt: string

  reservationStatus: string
  usageStatus: string | null

  vehicleId: string | null
  vehicleName: string | null
  plateNumber: string | null
}

export type UsageCountsResponse = Record<UsageTabId, number>
