import { db } from '@/db'
import { vehicles } from '@/db/schema/vehicles'
import { fail, ok } from '@/features/admin/_shared/api/api-response'
import { AdminRole } from '@/features/admin/auth/admin-role'
import { withAdminApi } from '@/features/admin/auth/with-admin-api'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const PATCH = withAdminApi(
  async ({ req, params }) => {
    const { vehicleId } = await params

    const vehicle = await db.query.vehicles.findFirst({
      where: eq(vehicles.id, vehicleId),
    })

    if (!vehicle) {
      return NextResponse.json(fail('NOT_FOUND', '해당 차량을 찾을 수 없습니다.'), { status: 404 })
    }

    const body = await req.json()

    await db
      .update(vehicles)
      .set({
        name: body.name,
        plateNumber: body.plateNumber,
        mileage: body.mileage,
        lastParkingZone: body.lastParkingZone,
        lastParkingNumber: body.lastParkingNumber,
        priority: body.priority ?? 0,
        fuelType: body.fuelType,
        fuelLevel: body.fuelLevel ?? 100,
        status: body.status ?? 'available',
        updatedAt: new Date(),
      })
      .where(eq(vehicles.id, vehicleId))
      .returning()

    return NextResponse.json(ok({ vehicleId }))
  },
  {
    role: AdminRole.RESERVATION_MANAGER,
  },
)
