'use server'

import { db } from '@/db'
import { DriverFormValues, driverSchema } from '../schema/driver-schema'
import { reservations } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function updateDriverInfo(reservationId: string, values: DriverFormValues) {
  // 1️⃣ 검증
  const parsed = driverSchema.parse(values)

  // 2️⃣ 도메인 타입으로 명시
  const data: DriverFormValues = parsed

  await db
    .update(reservations)
    .set({
      driverName: data.name,
      driverPhone: data.phone,
      updatedAt: new Date(),
    })
    .where(eq(reservations.id, reservationId))

  return { success: true }
}
