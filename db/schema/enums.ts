import { pgEnum } from 'drizzle-orm/pg-core'

export const reservationStatusEnum = pgEnum('reservation_status', [
  'pending',
  'approved',
  'rejected',
  'cancelled',
])

export const cancelActorTypeEnum = pgEnum('cancel_actor_type', ['user', 'admin', 'system'])
