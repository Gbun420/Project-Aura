let cachedDb = null;

export async function getDb() {
  if (cachedDb) {
    return cachedDb;
  }

  const mod = await import("../../server/src/core/database");
  cachedDb = mod.db;
  return cachedDb;
}
