import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { adminRoleEnum } from './admin-profiles'

export const pendingAdminInvites = pgTable('pending_admin_invites', {
  id: uuid('id').defaultRandom().primaryKey(),

  email: text('email').notNull().unique(),

  name: text('name').notNull(),

  role: adminRoleEnum('role').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
