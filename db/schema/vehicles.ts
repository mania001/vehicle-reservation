import { integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const vehicleStatusEnum = pgEnum('vehicle_status', ['available', 'maintenance', 'inactive'])

export const fuelTypeEnum = pgEnum('fuel_type', ['gasoline', 'diesel', 'lpg', 'hybrid', 'electric'])

export const vehicles = pgTable('vehicles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  plateNumber: text('plate_number').notNull(),
  status: vehicleStatusEnum('status').default('available').notNull(),

  // 최신 주행 데이터 (반납 시 동기화)
  mileage: integer('mileage').default(0).notNull(),

  // 최신 주차 위치 (반납 시 동기화)
  lastParkingZone: text('last_parking_zone'), // 예: B2층
  lastParkingNumber: text('last_parking_number'), // 예: 105번 기둥

  /**
   * 추천 정렬용
   * priority가 높을수록 먼저 추천됨
   */
  priority: integer('priority').default(0).notNull(),

  fuelLevel: integer('fuel_level').default(100).notNull(),
  fuelType: fuelTypeEnum('fuel_type').default('gasoline').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
