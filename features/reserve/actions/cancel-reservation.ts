'use server'

import { db } from '@/db'
import { reservations } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function cancelReservation(reservationId: string, reason: string) {
  await db
    .update(reservations)
    .set({
      status: 'cancelled',
      cancelledAt: new Date(),
      cancelActorType: 'user',
      cancelReason: reason,
      updatedAt: new Date(),
    })
    .where(eq(reservations.id, reservationId))

  return { success: true }
}
