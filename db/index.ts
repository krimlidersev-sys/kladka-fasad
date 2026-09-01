import { env } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

const createLeadsSql = `CREATE TABLE IF NOT EXISTS leads (
  id text PRIMARY KEY NOT NULL,
  created_at integer NOT NULL,
  work_type text NOT NULL,
  volume integer NOT NULL,
  days integer NOT NULL,
  people integer NOT NULL,
  estimate_amount integer NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  file_name text,
  file_key text,
  file_size integer,
  file_type text,
  status text DEFAULT 'new' NOT NULL
)`;

const createCreatedAtIndexSql =
  'CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at)';

export function getBindings() {
  if (!env.DB || !env.FILES) {
    throw new Error('Site storage bindings are unavailable.');
  }
  return { database: env.DB, files: env.FILES };
}

export async function getDb() {
  const { database } = getBindings();
  await database.batch([
    database.prepare(createLeadsSql),
    database.prepare(createCreatedAtIndexSql),
  ]);
  return drizzle(database, { schema });
}
