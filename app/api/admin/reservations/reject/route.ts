import { db } from '@/db'
import { reservations } from '@/db/schema'
import { ReservationStatus } from '@/domains/reservation/reservation-status'
import { fail, ok } from '@/features/admin/_shared/api/api-response'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

type RejectReservationBody = {
  reservationId: string
  reason: string
}

export async function POST(req: Request) {
  // 권한 체크 해야 함
  const body = (await req.json()) as RejectReservationBody

  const { reservationId, reason } = body

  if (!reservationId) {
    return NextResponse.json(fail('VALIDATION_ERROR', 'reservationId가 필요합니다.'), {
      status: 400,
    })
  }

  if (!reason || reason.trim().length < 2) {
    return NextResponse.json(fail('VALIDATION_ERROR', '반려 사유를 입력해주세요.'), { status: 400 })
  }

  const reservation = await db.query.reservations.findFirst({
    where: eq(reservations.id, reservationId),
  })

  if (!reservation) {
    return NextResponse.json(fail('NOT_FOUND', '예약을 찾을 수 없습니다.'), { status: 404 })
  }

  if (reservation.status !== 'pending') {
    return NextResponse.json(fail('CONFLICT', 'pending 상태의 예약만 반려할 수 있습니다.'), {
      status: 409,
    })
  }

  await db
    .update(reservations)
    .set({
      status: ReservationStatus.REJECTED,
      rejectedAt: new Date(),
      rejectedReason: body.reason.trim(),
      updatedAt: new Date(),
    })
    .where(eq(reservations.id, reservationId))

  /**
   * TODO: audit_logs insert
   * - action: reservation.rejected
   * - actorAdminId: from session
   * - payload: { reservationId, reason }
   */

  return NextResponse.json(ok({ reservationId: reservation.id }))
}
