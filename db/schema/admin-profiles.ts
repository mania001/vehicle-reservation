import { boolean, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const adminRoleEnum = pgEnum('admin_role', [
  'reservation_manager', // 예약 관리자
  'vehicle_manager', // 차량 관리자
  'super_admin', // 슈퍼 관리자
])

export const adminProfiles = pgTable('admin_profiles', {
  id: uuid('id').primaryKey(),

  role: adminRoleEnum('role').notNull().default('vehicle_manager'),

  name: text('name').notNull(),

  isActive: boolean('is_active').notNull().default(false),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),

  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),

  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
})
