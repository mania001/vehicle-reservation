import { SelectionState } from '../api/inspect-usage'

export type ReturnInfo = {
  type: 'after_driive' | 'before_drive' | 'admin_inspect'
  usageSessionId: string
  mileage: number
  fuelLevel: number
  isFueled: boolean
  fuelAmount: number
  parkingZone: string
  parkingNumber: string
  isCleaned: boolean
  note: string
  photos: {
    before: string[]
    after: string[]
    admin?: string[]
  }
  fuel?: {
    is_fueled: boolean
    fuel_amount: number
  }
  selections?: SelectionState
  notes?: {
    before: string
    after: string
    admin?: string
  }
  mileages?: {
    before: number
    after: number
    admin: number
    driving: number
  }
}
