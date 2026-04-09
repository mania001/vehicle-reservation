import { db } from '@/db'
import { vehicles } from '@/db/schema'
import { ok } from '@/features/admin/_shared/api/api-response'
import { AdminRole } from '@/features/admin/auth/admin-role'
import { withAdminApi } from '@/features/admin/auth/with-admin-api'
import { NextResponse } from 'next/server'

export const GET = withAdminApi(async () => {
  const rows = await db.query.vehicles.findMany({
    orderBy: (v, { desc }) => desc(v.createdAt),
  })

  return NextResponse.json(ok({ items: rows }))
})

export const POST = withAdminApi(
  async ({ req }) => {
    const body = await req.json()

    const now = new Date()

    const [vehicle] = await db
      .insert(vehicles)
      .values({
        name: body.name,
        plateNumber: body.plateNumber,
        mileage: body.mileage ?? 0,
        lastParkingZone: body.lastParkingZone,
        lastParkingNumber: body.lastParkingNumber,
        priority: body.priority ?? 0,
        fuelType: body.fuelType,
        fuelLevel: body.fuelLevel ?? 100,
        status: body.status ?? 'available',
        createdAt: now,
      })
      .returning()

    return NextResponse.json(ok({ vehicle }))
  },
  {
    role: AdminRole.RESERVATION_MANAGER,
  },
)
