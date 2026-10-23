import { randomBytes } from "node:crypto";
import { getDb, transaction } from "./db";
import type { PreviewProduct } from "./preview-products";

export const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export const LOW_STOCK = 5;

// ---------- Products ----------
export type ProductRow = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  original_price: number | null;
  stock: number;
  status: "active" | "draft";
  position: number;
  created_at: number;
};

export function listProducts(opts: { onlyActive?: boolean } = {}): ProductRow[] {
  const sql = `SELECT * FROM products ${opts.onlyActive ? "WHERE status = 'active'" : ""} ORDER BY position, created_at`;
  return getDb().prepare(sql).all() as ProductRow[];
}

export function getProduct(id: string): ProductRow | undefined {
  return getDb().prepare("SELECT * FROM products WHERE id = ?").get(id) as ProductRow | undefined;
}

export function discountOf(p: Pick<ProductRow, "price" | "original_price">): number {
  if (!p.original_price || p.original_price <= p.price) return 0;
  return Math.round(((p.original_price - p.price) / p.original_price) * 100);
}

// Shape the storefront cards expect.
export function toStoreProduct(p: ProductRow): PreviewProduct {
  const discount = discountOf(p);
  return {
    id: p.id,
    category: p.category,
    image: p.image || undefined,
    name: p.name,
    price: p.price,
    originalPrice: discount ? (p.original_price as number) : undefined,
    discountPercentage: discount || undefined,
    soldOut: p.stock <= 0,
  };
}

export function listStoreProducts(): PreviewProduct[] {
  return listProducts({ onlyActive: true }).map(toStoreProduct);
}

export type ProductInput = {
  name: string;
  category: string;
  image: string;
  price: number;
  original_price: number | null;
  stock: number;
  status: "active" | "draft";
};

export function createProduct(input: ProductInput): string {
  const id = `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
  const { m } = getDb().prepare("SELECT COALESCE(MAX(position), 0) AS m FROM products").get() as { m: number };
  getDb()
    .prepare(
      "INSERT INTO products (id, name, category, image, price, original_price, stock, status, position, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .run(id, input.name, input.category, input.image, input.price, input.original_price, input.stock, input.status, m + 1, Date.now());
  return id;
}

export function updateProduct(id: string, input: ProductInput) {
  getDb()
    .prepare(
      "UPDATE products SET name = ?, category = ?, image = ?, price = ?, original_price = ?, stock = ?, status = ? WHERE id = ?",
    )
    .run(input.name, input.category, input.image, input.price, input.original_price, input.stock, input.status, id);
}

export function deleteProduct(id: string) {
  getDb().prepare("DELETE FROM products WHERE id = ?").run(id);
}

// ---------- Customers ----------
export type CustomerRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: number;
  orders?: number;
};

export function listCustomers(): CustomerRow[] {
  return getDb()
    .prepare(
      "SELECT c.*, (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS orders FROM customers c ORDER BY c.created_at DESC",
    )
    .all() as CustomerRow[];
}

export function getCustomer(id: number): CustomerRow | undefined {
  return getDb().prepare("SELECT * FROM customers WHERE id = ?").get(id) as CustomerRow | undefined;
}

export type CustomerInput = { name: string; email: string; phone: string; address: string };

export function createCustomer(c: CustomerInput): number {
  const r = getDb()
    .prepare("INSERT INTO customers (name, email, phone, address, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(c.name, c.email, c.phone, c.address, Date.now());
  return Number(r.lastInsertRowid);
}

export function updateCustomer(id: number, c: CustomerInput) {
  getDb().prepare("UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?").run(c.name, c.email, c.phone, c.address, id);
}

export function deleteCustomer(id: number) {
  getDb().prepare("DELETE FROM customers WHERE id = ?").run(id);
}

// ---------- Orders ----------
export const PAYMENT_METHODS = ["cod", "bank", "manual"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: "Cash on delivery",
  bank: "Bank transfer",
  manual: "Entered by admin",
};

export type OrderRow = {
  id: number;
  public_code: string | null;
  email: string;
  address: string;
  payment_method: PaymentMethod;
  delivery_fee: number;
  customer_id: number | null;
  customer_name: string;
  customer_phone: string;
  status: OrderStatus;
  note: string;
  total: number;
  created_at: number;
};
export type OrderItemRow = { id: number; order_id: number; product_id: string | null; name: string; price: number; qty: number };

export function listOrders(limit?: number): OrderRow[] {
  return getDb()
    .prepare(`SELECT * FROM orders ORDER BY created_at DESC ${limit ? "LIMIT " + Math.floor(limit) : ""}`)
    .all() as OrderRow[];
}

export function getOrderByCode(code: string): { order: OrderRow; items: OrderItemRow[] } | undefined {
  if (!/^[a-f0-9]{20}$/.test(code)) return undefined;
  const row = getDb().prepare("SELECT id FROM orders WHERE public_code = ?").get(code) as { id: number } | undefined;
  return row ? getOrder(row.id) : undefined;
}

// Link an online order to an existing customer (same phone or email), or add a new one.
export function findOrCreateCustomer(c: { name: string; email: string; phone: string; address: string }): number {
  const db = getDb();
  const found = db
    .prepare("SELECT id FROM customers WHERE (phone != '' AND phone = ?) OR (email != '' AND email = ?) LIMIT 1")
    .get(c.phone, c.email) as { id: number } | undefined;
  if (found) {
    db.prepare("UPDATE customers SET address = ? WHERE id = ? AND ? != ''").run(c.address, found.id, c.address);
    return found.id;
  }
  return createCustomer(c);
}

export function getOrder(id: number): { order: OrderRow; items: OrderItemRow[] } | undefined {
  const order = getDb().prepare("SELECT * FROM orders WHERE id = ?").get(id) as OrderRow | undefined;
  if (!order) return undefined;
  const items = getDb().prepare("SELECT * FROM order_items WHERE order_id = ?").all(id) as OrderItemRow[];
  return { order, items };
}

export type NewOrderInput = {
  customer_id: number | null;
  customer_name: string;
  customer_phone: string;
  email?: string;
  address?: string;
  payment_method?: PaymentMethod;
  delivery_fee?: number;
  note: string;
  items: { productId: string; qty: number }[];
};

// Creates the order, snapshots names/prices, and takes the stock — all or nothing.
export function createOrder(input: NewOrderInput): number {
  return transaction(() => {
    const db = getDb();
    let total = 0;
    const lines: { productId: string; name: string; price: number; qty: number }[] = [];
    for (const it of input.items) {
      const p = getProduct(it.productId);
      if (!p) throw new Error("A selected product no longer exists.");
      if (p.stock < it.qty) throw new Error(`Not enough stock for "${p.name}" (only ${p.stock} left).`);
      lines.push({ productId: p.id, name: p.name, price: p.price, qty: it.qty });
      total += p.price * it.qty;
    }
    const fee = input.delivery_fee ?? 0;
    const r = db
      .prepare(
        "INSERT INTO orders (public_code, customer_id, customer_name, customer_phone, email, address, payment_method, delivery_fee, status, note, total, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)",
      )
      .run(
        randomBytes(10).toString("hex"), input.customer_id, input.customer_name, input.customer_phone,
        input.email ?? "", input.address ?? "", input.payment_method ?? "manual", fee,
        input.note, Math.round((total + fee) * 100) / 100, Date.now(),
      );
    const orderId = Number(r.lastInsertRowid);
    for (const l of lines) {
      db.prepare("INSERT INTO order_items (order_id, product_id, name, price, qty) VALUES (?, ?, ?, ?, ?)").run(orderId, l.productId, l.name, l.price, l.qty);
      db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").run(l.qty, l.productId);
    }
    return orderId;
  });
}

// Cancelling puts the stock back; un-cancelling takes it again if available.
export function setOrderStatus(id: number, status: OrderStatus) {
  transaction(() => {
    const db = getDb();
    const found = getOrder(id);
    if (!found) throw new Error("Order not found.");
    const was = found.order.status;
    if (was === status) return;
    if (status === "cancelled") {
      for (const it of found.items) if (it.product_id) db.prepare("UPDATE products SET stock = stock + ? WHERE id = ?").run(it.qty, it.product_id);
    } else if (was === "cancelled") {
      for (const it of found.items) {
        if (!it.product_id) continue;
        const p = getProduct(it.product_id);
        if (!p || p.stock < it.qty) throw new Error(`Not enough stock to reopen: "${it.name}".`);
        db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").run(it.qty, it.product_id);
      }
    }
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
  });
}

// ---------- Dashboard ----------
export function dashboardStats() {
  const db = getDb();
  const one = (sql: string) => (db.prepare(sql).get() as { n: number }).n ?? 0;
  return {
    products: one("SELECT COUNT(*) AS n FROM products"),
    active: one("SELECT COUNT(*) AS n FROM products WHERE status = 'active'"),
    lowStock: one(`SELECT COUNT(*) AS n FROM products WHERE stock > 0 AND stock <= ${LOW_STOCK}`),
    outOfStock: one("SELECT COUNT(*) AS n FROM products WHERE stock <= 0"),
    orders: one("SELECT COUNT(*) AS n FROM orders"),
    pending: one("SELECT COUNT(*) AS n FROM orders WHERE status = 'pending'"),
    revenue: one("SELECT COALESCE(SUM(total), 0) AS n FROM orders WHERE status != 'cancelled'"),
    customers: one("SELECT COUNT(*) AS n FROM customers"),
  };
}

export function lowStockProducts(): ProductRow[] {
  return getDb().prepare(`SELECT * FROM products WHERE stock <= ${LOW_STOCK} ORDER BY stock, name LIMIT 8`).all() as ProductRow[];
}

// ---------- Settings ----------
export function readSettingRows(): Record<string, string> {
  const rows = getDb().prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export function saveSettings(values: Record<string, string>) {
  transaction(() => {
    const stmt = getDb().prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value");
    for (const [k, v] of Object.entries(values)) stmt.run(k, v);
  });
}
