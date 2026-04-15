import { UsageStatus } from '../usage-session/usage-status'
import { FuelType } from '../vehicle/vehicle-status'
import { ReservationStatus } from './reservation-status'

export interface ReservationCreateInput {
  name: string
  organization: string
  phone: string
  startAt: Date
  endAt: Date
  purpose: string
  destination: string
}

export interface Reservation {
  id: string
  publicCode: string
  requesterName: string
  requesterPhone: string
  organization: string
  startAt: Date
  endAt: Date
  purpose: string
  destination: string
  status: ReservationStatus
  createdAt: Date

  usageSessionId?: string | null
  usageStatus?: UsageStatus | null

  vehicle?: {
    id: string
    name: string
    plateNumber: string
    fuelLevel?: number
    fuelType?: FuelType
    // 최신 주행 데이터 (반납 시 동기화)
    mileage?: number
    // 최신 주차 위치 (반납 시 동기화)
    lastParkingZone?: string | null
    lastParkingNumber?: string | null
  } | null
}
