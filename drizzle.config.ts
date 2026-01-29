import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: ['./db/schema/**/*.ts', '!./db/schema/_external/**'],
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
