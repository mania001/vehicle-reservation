import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { usageSessionChecks } from './usage-session-checks'

export const usageSessionPhotos = pgTable('usage_session_photos', {
  id: uuid('id').primaryKey().defaultRandom(),

  usageSessionId: uuid('usage_session_id').notNull(),

  checkId: uuid('check_id').references(() => usageSessionChecks.id),

  type: text('type').notNull(),

  url: text('url').notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).defaultNow(),
})
