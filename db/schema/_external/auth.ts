import { pgSchema, text, uuid } from 'drizzle-orm/pg-core'

/**
 * ⚠️ READ-ONLY SCHEMA
 * - Supabase 소유
 * - migration ❌
 * - insert/update/delete ❌
 * - join/select 용도만 사용
 */
export const authSchema = pgSchema('auth')

export const authUsers = authSchema.table('users', {
  id: uuid('id').primaryKey(),
  email: text('email'),
})
