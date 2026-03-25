import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { usageSessionChecks } from './usage-session-checks'

export const usageSessionCheckItems = pgTable('usage_session_check_items', {
  id: uuid('id').primaryKey().defaultRandom(),

  checkId: uuid('check_id')
    .notNull()
    .references(() => usageSessionChecks.id),

  key: text('key').notNull(),

  value: boolean('value').notNull(),

  note: text('note'),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).defaultNow(),
})
