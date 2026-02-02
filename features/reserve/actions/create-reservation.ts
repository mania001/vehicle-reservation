'use server'

import { generatePublicCode } from '@/lib/public-code'
import { db } from '@/db'
import { reservations } from '@/db/schema'
import { ReservationStatus } from '@/domains/reservation/reservation-status'
import { ReserveFormValues } from '../hooks/use-reserve-form'
import { reservationCoreSchema } from '@/domains/reservation/reservation.schema'
import { ReservationCreateInput } from '@/domains/reservation/reservation.types'
import { toUTC } from '@/lib/time'

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

  // 2️⃣ 도메인 타입으로 명시
  const data: ReservationCreateInput = parsed

  const publicCode = generatePublicCode()

  const [reservation] = await db
    .insert(reservations)
    .values({
      requesterName: data.name,
      requesterPhone: data.phone,
      organization: data.organization,

      startAt: toUTC(data.startAt),
      endAt: toUTC(data.endAt),
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
