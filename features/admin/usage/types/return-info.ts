export type ReturnInfo = {
  type: 'after_driive' | 'before_drive'
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
  }
}
