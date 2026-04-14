import { index, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const reservationStatusEnum = pgEnum('reservation_status', [
  'pending',
  'approved',
  'rejected',
  'cancelled',
  'closed',
])

export const cancelActorTypeEnum = pgEnum('cancel_actor_type', ['user', 'admin', 'system'])

export const reservations = pgTable(
  'reservations',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    // 🔑 외부 공유용 코드
    publicCode: text('public_code').notNull().unique(),

    // 예약자 정보
    requesterName: text('requester_name').notNull(),
    requesterPhone: text('requester_phone').notNull(),

    // 소속 (부서/팀/기관명)
    organization: text('organization').notNull(),

    // 사용 정보
    purpose: text('purpose').notNull(),
    destination: text('destination').notNull(),

    startAt: timestamp('start_at', { withTimezone: true }).notNull(),
    endAt: timestamp('end_at', { withTimezone: true }).notNull(),

    status: reservationStatusEnum('status').notNull().default('pending'),

    // ✅ 운전자 정보
    driverName: text('driver_name'),
    driverPhone: text('driver_phone'),

    /**
     * 취소 관련 (cancelled 전용)
     */
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    cancelActorType: cancelActorTypeEnum('cancel_actor_type'),
    cancelReason: text('cancel_reason'),

    /**
     * 반려 관련 (rejected 전용)
     */
    rejectedAt: timestamp('rejected_at', { withTimezone: true }),
    rejectedReason: text('rejected_reason'),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),

    updatedAt: timestamp('updated_at', { withTimezone: true }),
  },
  table => {
    return {
      // CREATE INDEX idx_res_status_created ON reservations(status, created_at);
      idxResStatusCreated: index('idx_res_status_created').on(table.status, table.createdAt),

      // CREATE INDEX idx_res_status_end ON reservations(status, end_at);
      idxResStatusEnd: index('idx_res_status_end').on(table.status, table.endAt),

      idxResStatusUpdated: index('idx_res_status_updated').on(table.status, table.updatedAt),
    }
  },
)
