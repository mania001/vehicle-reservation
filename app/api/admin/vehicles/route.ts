import { db } from '@/db'
import { vehicles } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  const rows = await db
    .select({
      id: vehicles.id,
      name: vehicles.name,
      numberPlate: vehicles.plateNumber,
    })
    .from(vehicles)
    .where(eq(vehicles.status, 'available'))
    .orderBy(asc(vehicles.name))

  return NextResponse.json(rows)
}
