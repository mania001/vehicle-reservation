import { db } from '@/db'
import { usageSessions, vehicles } from '@/db/schema'
import { and, asc, desc, eq, gt, inArray, isNotNull, lt, notInArray, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const startAtRaw = searchParams.get('startAt')
    const endAtRaw = searchParams.get('endAt')

    if (!startAtRaw || !endAtRaw) {
      return NextResponse.json(
        { success: false, error: 'startAt, endAt은 필수입니다.' },
        { status: 400 },
      )
    }

    const startAt = new Date(startAtRaw)
    const endAt = new Date(endAtRaw)

    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
      return NextResponse.json(
        { success: false, error: 'startAt/endAt 날짜 형식이 올바르지 않습니다.' },
        { status: 400 },
      )
    }

    if (startAt >= endAt) {
      return NextResponse.json(
        { success: false, error: 'startAt은 endAt보다 이전이어야 합니다.' },
        { status: 400 },
      )
    }

    /**
     * 시간 겹침 판단:
     * requestedStart < scheduledEnd AND requestedEnd > scheduledStart
     */
    const conflictVehicleRows = await db
      .select({
        vehicleId: usageSessions.vehicleId,
      })
      .from(usageSessions)
      .where(
        and(
          isNotNull(usageSessions.vehicleId),
          inArray(usageSessions.status, ['scheduled', 'checked_out']),
          lt(sql`${startAt.toISOString()}`, usageSessions.scheduledEndAt),
          gt(sql`${endAt.toISOString()}`, usageSessions.scheduledStartAt),
        ),
      )

    const excludedVehicleIds = conflictVehicleRows
      .map(r => r.vehicleId)
      .filter((v): v is string => Boolean(v))

    /**
     * 추천 정렬용 lastUsedAt 계산:
     * vehicleId별 checkedOutAt max
     */
    const lastUsedAtSubquery = db
      .select({
        vehicleId: usageSessions.vehicleId,
        lastUsedAt: sql<Date>`max(${usageSessions.checkedOutAt})`.as('last_used_at'),
      })
      .from(usageSessions)
      .where(and(isNotNull(usageSessions.vehicleId)))
      .groupBy(usageSessions.vehicleId)
      .as('last_used')

    const availableVehicles = await db
      .select({
        id: vehicles.id,
        name: vehicles.name,
        plateNumber: vehicles.plateNumber,
        status: vehicles.status,
        priority: vehicles.priority,
        fuelLevel: vehicles.fuelLevel,
        fuelType: vehicles.fuelType,
        lastUsedAt: lastUsedAtSubquery.lastUsedAt,
        updatedAt: vehicles.updatedAt,
      })
      .from(vehicles)
      .leftJoin(lastUsedAtSubquery, eq(lastUsedAtSubquery.vehicleId, vehicles.id))
      .where(
        and(
          eq(vehicles.status, 'available'),
          excludedVehicleIds.length > 0 ? notInArray(vehicles.id, excludedVehicleIds) : undefined,
        ),
      )
      .orderBy(
        desc(vehicles.priority),
        asc(lastUsedAtSubquery.lastUsedAt), // 오래전에 사용한 차량 우선 (null 먼저)
        asc(vehicles.name),
      )

    // 각 차량별 최근 3건 히스토리 조회
    const result = await Promise.all(
      availableVehicles.map(async v => {
        const history = await db
          .select({
            usageId: usageSessions.id,
            startAt: usageSessions.scheduledStartAt,
            endAt: usageSessions.scheduledEndAt,
            status: usageSessions.status,
            reservationId: usageSessions.reservationId,
          })
          .from(usageSessions)
          .where(eq(usageSessions.vehicleId, v.id))
          .orderBy(desc(usageSessions.scheduledStartAt))
          .limit(3)

        return {
          ...v,
          history: history.map(h => ({
            usageId: h.usageId,
            startAt: h.startAt.toISOString(),
            endAt: h.endAt.toISOString(),
            status: h.status,
            reservationId: h.reservationId,
          })),
          updatedAt: v.updatedAt.toISOString(),
        }
      }),
    )

    return NextResponse.json({
      success: true,
      items: result.map(v => ({
        id: v.id,
        name: v.name,
        plateNumber: v.plateNumber,
        lastUsedAt: v.lastUsedAt ? new Date(v.lastUsedAt).toISOString() : null,
        status: v.status,
        priority: v.priority,
        fuelLevel: v.fuelLevel,
        fuelType: v.fuelType,
        history: v.history,
      })),
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 },
    )
  }
}
