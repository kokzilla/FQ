/**
 * Database State for SQLite.
 * SQLite is an embedded file-based database, so it is always available with 0ms latency.
 */
export async function isDbReady(): Promise<boolean> {
  return true
}
