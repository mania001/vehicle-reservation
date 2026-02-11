import { db } from '@/db'
import { reservations, usageSessions } from '@/db/schema'
import { ReservationStatus } from '@/domains/reservation/reservation-status'
import { UsageStatus } from '@/domains/usage-session/usage-status'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  const reservationId = body?.reservationId as string | undefined
  const vehicleId = body?.vehicleId as string | null | undefined

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
  //     { success: false, error: 'Only pending reservation can be approved' },
  //     { status: 400 },
  //   )
  // }

  await db.transaction(async tx => {
    await tx
      .update(reservations)
      .set({
        status: ReservationStatus.APPROVED,
        updatedAt: new Date(),
      })
      .where(eq(reservations.id, reservationId))

    const existing = await tx.query.usageSessions.findFirst({
      where: eq(usageSessions.reservationId, reservationId),
    })

    if (!existing) {
      await tx.insert(usageSessions).values({
        reservationId,
        vehicleId,
        status: UsageStatus.SCHEDULED,
        approvedAt: new Date(),
        scheduledStartAt: reservation.startAt,
        scheduledEndAt: reservation.endAt,
      })
    } else {
      await tx
        .update(usageSessions)
        .set({
          vehicleId,
          updatedAt: new Date(),
        })
        .where(eq(usageSessions.reservationId, reservationId))
    }
  })

  return NextResponse.json({ success: true })
}
