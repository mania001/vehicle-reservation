import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const vehicleStatusEnum = pgEnum('vehicle_status', ['available', 'maintenance', 'inactive'])

export const vehicles = pgTable('vehicles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  plateNumber: text('plate_number').notNull(),
  status: vehicleStatusEnum('status').default('available').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
