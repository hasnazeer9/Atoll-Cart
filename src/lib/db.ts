import { DatabaseSync } from "node:sqlite";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { previewProducts } from "./preview-products";

// One SQLite file holds everything the admin portal manages. It lives in
// ./data (git-ignored) so it is never committed.
// On a server, point DATA_DIR at a persistent disk (for example /data).
export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const globalForDb = globalThis as unknown as { __atollDb?: DatabaseSync };

function init(): DatabaseSync {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const db = new DatabaseSync(path.join(DATA_DIR, "atollcart.db"));
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT '',
      price REAL NOT NULL,
      original_price REAL,
      stock INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      position INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      note TEXT NOT NULL DEFAULT '',
      total REAL NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id TEXT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      qty INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Upgrade older databases in place (safe to run every time).
  const addColumn = (table: string, column: string, ddl: string) => {
    const cols = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
    if (!cols.some((c) => c.name === column)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${ddl}`);
  };
  addColumn("customers", "password_hash", "TEXT");
  db.exec(`
    CREATE TABLE IF NOT EXISTS customer_sessions (
      token_hash TEXT PRIMARY KEY,
      customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS customers_account_email ON customers(email) WHERE password_hash IS NOT NULL;
  `);
  addColumn("orders", "public_code", "TEXT");
  addColumn("orders", "email", "TEXT NOT NULL DEFAULT ''");
  addColumn("orders", "address", "TEXT NOT NULL DEFAULT ''");
  addColumn("orders", "payment_method", "TEXT NOT NULL DEFAULT 'manual'");
  addColumn("orders", "delivery_fee", "REAL NOT NULL DEFAULT 0");
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS orders_public_code ON orders(public_code)");
  const missing = db.prepare("SELECT id FROM orders WHERE public_code IS NULL").all() as { id: number }[];
  for (const { id } of missing) db.prepare("UPDATE orders SET public_code = ? WHERE id = ?").run(randomBytes(10).toString("hex"), id);

  // First run: load the sample catalogue so the shop is not empty.
  const { n } = db.prepare("SELECT COUNT(*) AS n FROM products").get() as { n: number };
  if (n === 0) {
    const insert = db.prepare(
      "INSERT INTO products (id, name, category, image, price, original_price, stock, status, position, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)",
    );
    previewProducts.forEach((p, i) => {
      insert.run(p.id, p.name ?? "", p.category, p.image ?? "", p.price ?? 0, p.originalPrice ?? null, 25, i, Date.now());
    });
  }
  return db;
}

export function getDb(): DatabaseSync {
  if (!globalForDb.__atollDb) globalForDb.__atollDb = init();
  return globalForDb.__atollDb;
}

// Run several statements as one all-or-nothing unit.
export function transaction<T>(fn: () => T): T {
  const db = getDb();
  db.exec("BEGIN");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
