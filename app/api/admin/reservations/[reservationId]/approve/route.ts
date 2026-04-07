import { db } from '@/db'
import { reservations } from '@/db/schema/reservations'
import { usageSessions } from '@/db/schema/usage-sessions'
import { ReservationStatus } from '@/domains/reservation/reservation-status'
import { UsageStatus } from '@/domains/usage-session/usage-status'
import { fail, ok } from '@/features/admin/_shared/api/api-response'
import { withAudit } from '@/features/admin/_shared/audit/with-audit'
import { AdminRole } from '@/features/admin/auth/admin-role'
import { withAdminApi } from '@/features/admin/auth/with-admin-api'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const POST = withAdminApi<Response, { reservationId: string }>(
  async ({ admin, req, params }) => {
    const { reservationId } = await params
    const body = await req.json()

    const vehicleId = body?.vehicleId as string | null | undefined

    const reservation = await db.query.reservations.findFirst({
      where: eq(reservations.id, reservationId),
    })

    if (!reservation) {
      return NextResponse.json(fail('NOT_FOUND', '예약을 찾을 수 없습니다.'), { status: 404 })
    }

    const now = new Date()

    await withAudit(
      req,
      {
        reservationId: reservationId,
        action: 'reservation.approve',
        entityType: 'reservation',
        entityId: reservationId,
        actorType: 'admin',
        actorId: admin.id,
        message: '예약이 승인되었습니다.',
        prevData: {
          status: reservation.status,
        },
        nextData: {
          status: ReservationStatus.APPROVED,
        },
      },
      async () => {
        await db.transaction(async tx => {
          await tx
            .update(reservations)
            .set({
              status: ReservationStatus.APPROVED,
              updatedAt: now,
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
              approvedAt: now,
              scheduledStartAt: reservation.startAt,
              scheduledEndAt: reservation.endAt,
            })
          } else {
            await tx
              .update(usageSessions)
              .set({
                vehicleId,
                updatedAt: now,
              })
              .where(eq(usageSessions.reservationId, reservationId))
          }
        })
      },
    )

    return NextResponse.json(ok({ reservationId }))
  },
  { role: AdminRole.RESERVATION_MANAGER },
)
