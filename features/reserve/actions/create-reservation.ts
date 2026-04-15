'use server'

import { generatePublicCode } from '@/lib/public-code'
import { db } from '@/db'
import { reservations } from '@/db/schema'
import { ReservationStatus } from '@/domains/reservation/reservation-status'
import { ReserveFormValues } from '../hooks/use-reserve-form'
import { reservationCoreSchema } from '@/domains/reservation/reservation.schema'
import { ReservationCreateInput } from '@/domains/reservation/reservation.types'

export async function createReservation(values: ReserveFormValues) {
  // 1️⃣ 검증
  const parsed = reservationCoreSchema.parse(values)

  // if (!parsed.success) {
  //   return {
  //     success: false,
  //     // error: z.flattenError(parsed.error),
  //     error: '입력값이 올바르지 않습니다.',
  //   }
  // }
  if (!parsed.range.startAt || !parsed.range.endAt) {
    throw new Error('예약 시간이 올바르지 않습니다.')
  }

  const data: ReservationCreateInput = {
    name: parsed.name,
    phone: parsed.phone,
    organization: parsed.organization,
    startAt: parsed.range.startAt,
    endAt: parsed.range.endAt,
    purpose: parsed.purpose,
    destination: parsed.destination,
  }

  const publicCode = generatePublicCode()

  const [reservation] = await db
    .insert(reservations)
    .values({
      requesterName: data.name,
      requesterPhone: data.phone,
      organization: data.organization,
      startAt: data.startAt,
      endAt: data.endAt,
      purpose: data.purpose,
      destination: data.destination,
      publicCode,
      status: ReservationStatus.PENDING,
    })
    .returning({ publicCode: reservations.publicCode })

  return {
    success: true,
    publicCode: reservation.publicCode,
  }
}
