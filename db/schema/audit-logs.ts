import { jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { reservations } from './reservations'

export const auditActionEnum = pgEnum('audit_action', [
  // reservation admin actions
  'reservation.approve',
  'reservation.reject',
  'reservation.cancel',
  'reservation.close',

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
  'usage_session',
  'vehicle',
  'admin',
])

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),

  /**
   * 🔑 "예약 단위 타임라인 조회용 Master Key"
   * reservation 상세 페이지에서 audit_logs 조회 시 여기로 필터링
   */
  reservationId: uuid('reservation_id')
    .references(() => reservations.id, { onDelete: 'cascade' })
    .notNull(),

  /**
   * entityType/entityId는 "정확한 대상"
   * - reservation.reject → entityType=reservation, entityId=reservation.id
   * - usage.check_out → entityType=usage_session, entityId=usageSession.id
   */
  entityType: auditEntityTypeEnum('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),

  action: auditActionEnum('action').notNull(),

  actorType: auditActorTypeEnum('actor_type').notNull(),
  actorId: uuid('actor_id'), // system이면 null 가능

  message: text('message'),

  prevData: jsonb('prev_data'),
  nextData: jsonb('next_data'),

  metadata: jsonb('metadata'), // ip, userAgent, requestId 등

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
