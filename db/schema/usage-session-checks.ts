import { integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const checkTypeEnum = pgEnum('check_type', [
  'before_drive', // 운전 전 사용하기
  'after_drive', // 운전 후 반납
  'admin_inspect', // 차량 관리자 검증
])

export const usageSessionChecks = pgTable('usage_session_checks', {
  id: uuid('id').defaultRandom().primaryKey(),
  usageSessionId: uuid('usage_session_id').notNull(),

  type: checkTypeEnum('type').notNull(),

  mileage: integer('mileage'),
  fuelLevel: integer('fuel_level'),
  // 0~100 %

  // 주차 정보 (주로 반납 시 사용)
  parkingZone: text('parking_zone'),
  parkingNumber: text('parking_number'),

  note: text('note'),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).defaultNow(),
})
