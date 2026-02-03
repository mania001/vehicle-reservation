import { pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { reservations } from './reservations'
import { vehicles } from './vehicles'

export const usageStatusEnum = pgEnum('usage_status', [
  'scheduled', // 승인 완료, 사용 예정
  'checked_out', // 키 인수 완료, 사용 중
  'returned', // 정상 반납
  'no_show', // 노쇼 확정
  'cancelled', // 관리자에 의해 종료
])

export const usageSessions = pgTable('usage_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),

  /**
   * 관계
   */
  reservationId: uuid('reservation_id')
    .notNull()
    .references(() => reservations.id, { onDelete: 'cascade' }),

  vehicleId: uuid('vehicle_id').references(() => vehicles.id), // 승인 시점에는 null 가능

  /**
   * 상태
   */
  status: usageStatusEnum('status').notNull().default('scheduled'),

  /**
   * 예약 시간 스냅샷 (승인 시점 기준)
   */
  scheduledStartAt: timestamp('scheduled_start_at', {
    withTimezone: true,
  }).notNull(),

  scheduledEndAt: timestamp('scheduled_end_at', {
    withTimezone: true,
  }).notNull(),

  /**
   * 승인 / 사용 이벤트 시각
   */
  approvedAt: timestamp('approved_at', {
    withTimezone: true,
  }).notNull(),

  checkedOutAt: timestamp('checked_out_at', {
    withTimezone: true,
  }),

  returnedAt: timestamp('returned_at', {
    withTimezone: true,
  }),

  /**
   * 노쇼 관련
   */
  noShowReportedAt: timestamp('no_show_reported_at', {
    withTimezone: true,
  }),

  /**
   * 감사/추적
   */
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
})
