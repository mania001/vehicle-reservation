import { integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const vehicleStatusEnum = pgEnum('vehicle_status', ['available', 'maintenance', 'inactive'])

export const fuelTypeEnum = pgEnum('fuel_type', ['gasoline', 'diesel', 'lpg', 'hybrid', 'electric'])

export const fuelLevelEnum = pgEnum('fuel_level', [
  'empty',
  'quarter',
  'half',
  'three-quarter',
  'full',
])

export const vehicles = pgTable('vehicles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  plateNumber: text('plate_number').notNull(),
  status: vehicleStatusEnum('status').default('available').notNull(),

  /**
   * 추천 정렬용
   * priority가 높을수록 먼저 추천됨
   */
  priority: integer('priority').default(0).notNull(),

  fuelLevel: fuelLevelEnum('fuel_level').default('full').notNull(),
  fuelType: fuelTypeEnum('fuel_type').default('gasoline').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
