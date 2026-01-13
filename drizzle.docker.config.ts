import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'postgres',
    port: 5432,
    user: 'videovision',
    password: 'videovision_password',
    database: 'videovision',
    ssl: false,
  },
  verbose: true,
  strict: true,
})
