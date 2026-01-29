import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
// import * as schema from '@/db/schema'

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false, // Supabase Transaction Pool 대응
})

// export const db = drizzle(client, { schema })
export const db = drizzle({ client })
