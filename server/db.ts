import { and, asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { contentItems, InsertContentItem, InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  updateSet.lastSignedIn ??= new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listContentItems(type?: InsertContentItem["type"]) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(contentItems);
  if (type) {
    return query.where(eq(contentItems.type, type)).orderBy(asc(contentItems.sortOrder), asc(contentItems.id));
  }
  return query.orderBy(asc(contentItems.type), asc(contentItems.sortOrder), asc(contentItems.id));
}

export async function createContentItem(item: InsertContentItem) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(contentItems).values(item);
  const id = Number(result[0].insertId);
  const created = await db.select().from(contentItems).where(eq(contentItems.id, id)).limit(1);
  return created[0];
}

export async function updateContentItem(id: number, item: Partial<InsertContentItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(contentItems).set(item).where(eq(contentItems.id, id));
  const updated = await db.select().from(contentItems).where(eq(contentItems.id, id)).limit(1);
  return updated[0];
}

export async function deleteContentItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(contentItems).where(eq(contentItems.id, id));
  return { id };
}
