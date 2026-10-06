import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/** Core user table backing Manus OAuth and role-based admin access. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * One flexible content model powers the public collections and the admin editor.
 * type selects the collection; the other fields map to the display needs of each card.
 */
export const contentItems = mysqlTable("contentItems", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["event", "achievement", "topper", "faculty", "alumni", "gallery"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  detail: varchar("detail", { length: 255 }),
  dateLabel: varchar("dateLabel", { length: 255 }),
  sectionGroup: varchar("sectionGroup", { length: 64 }),
  imageUrl: text("imageUrl"),
  color: varchar("color", { length: 64 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContentItem = typeof contentItems.$inferSelect;
export type InsertContentItem = typeof contentItems.$inferInsert;
