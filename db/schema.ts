import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const analyticsDaily = sqliteTable("analytics_daily", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  day: text("day").notNull(),
  event: text("event").notNull(),
  dimension: text("dimension").notNull(),
  language: text("language").notNull(),
  count: integer("count").notNull().default(0),
  scoreSum: integer("score_sum").notNull().default(0),
}, (table) => [
  uniqueIndex("idx_analytics_daily_group").on(table.day, table.event, table.dimension, table.language),
]);
