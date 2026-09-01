import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const leads = sqliteTable(
  'leads',
  {
    id: text('id').primaryKey(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    workType: text('work_type', { enum: ['masonry', 'facade'] }).notNull(),
    volume: integer('volume').notNull(),
    days: integer('days').notNull(),
    people: integer('people').notNull(),
    estimateAmount: integer('estimate_amount').notNull(),
    address: text('address').notNull(),
    phone: text('phone').notNull(),
    fileName: text('file_name'),
    fileKey: text('file_key'),
    fileSize: integer('file_size'),
    fileType: text('file_type'),
    status: text('status', { enum: ['new', 'contacted', 'closed'] })
      .notNull()
      .default('new'),
  },
  (table) => [index('idx_leads_created_at').on(table.createdAt)],
);
