import { db } from '@/db'
import { reservations } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getReservationByPublicCode(publicCode: string) {
  const reservation = await db.query.reservations.findFirst({
    where: eq(reservations.publicCode, publicCode),
  })

  if (!reservation) {
    return null
  }

  return reservation
}
