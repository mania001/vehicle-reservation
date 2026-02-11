import { db } from '@/db'
import { reservations } from '@/db/schema'
import { ReservationStatus } from '@/domains/reservation/reservation-status'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  const reservationId = body?.reservationId as string | undefined

  if (!reservationId) {
    return NextResponse.json(
      { success: false, error: 'reservationId is required' },
      { status: 400 },
    )
  }

  const reservation = await db.query.reservations.findFirst({
    where: eq(reservations.id, reservationId),
  })

  if (!reservation) {
    return NextResponse.json({ success: false, error: 'Reservation not found' }, { status: 404 })
  }

  // if (reservation.status !== 'pending') {
  //   return NextResponse.json(
  //     { success: false, error: 'Only pending reservation can be rejected' },
  //     { status: 400 },
  //   )
  // }

  await db
    .update(reservations)
    .set({
      status: ReservationStatus.REJECTED,
      updatedAt: new Date(),
    })
    .where(eq(reservations.id, reservationId))

  return NextResponse.json({ success: true })
}
