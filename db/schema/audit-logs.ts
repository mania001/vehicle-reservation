import { jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const auditActionEnum = pgEnum('audit_action', [
  // reservation admin actions
  'reservation.approve',
  'reservation.reject',
  'reservation.cancel',

  // usage admin actions
  'usage.checkout',
  'usage.return',
  'usage.extend',
  'usage.forceReturn',
  'usage.inspect',

  // vehicle/admin maintenance
  'vehicle.create',
  'vehicle.update',
  'vehicle.delete',

  // auth/admin
  'admin.login',
  'admin.logout',
])

export const auditActorTypeEnum = pgEnum('audit_actor_type', ['admin', 'system'])

export const auditEntityTypeEnum = pgEnum('audit_entity_type', [
  'reservation',
  'usage',
  'vehicle',
  'admin_user',
])

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),

  action: auditActionEnum('action').notNull(),

  entityType: auditEntityTypeEnum('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),

  actorType: auditActorTypeEnum('actor_type').notNull(),
  actorId: uuid('actor_id'), // system이면 null 가능

  message: text('message'),

  prevData: jsonb('prev_data'),
  nextData: jsonb('next_data'),

  metadata: jsonb('metadata'), // ip, userAgent, requestId 등

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
