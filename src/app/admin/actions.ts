"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  adminExists, clearFailures, setupLockMessage, setupTokenValid, createSession, destroySession, hashPassword,
  loginBlocked, recordFailure, requireAdmin, verifyPassword,
} from "@/lib/auth";
import { getDb } from "@/lib/db";
import {
  ORDER_STATUSES, createCustomer, createOrder, createProduct, deleteCustomer, deleteProduct,
  getProduct, saveSettings, setOrderStatus, updateCustomer, updateProduct,
  type OrderStatus, type ProductInput,
} from "@/lib/data";
import { SETTING_KEYS } from "@/lib/settings";
import { previewCategories } from "@/lib/preview-products";
import { saveUpload } from "@/lib/uploads";

const text = (f: FormData, k: string, max = 500) => String(f.get(k) ?? "").trim().slice(0, max);
const fail = (path: string, msg: string): never => redirect(`${path}?error=${encodeURIComponent(msg)}`);
const refreshShop = () => revalidatePath("/", "layout");

// ---------- Auth ----------
export async function setupAction(formData: FormData) {
  if (adminExists()) redirect("/admin/login");
  if (setupLockMessage()) fail("/admin/setup", setupLockMessage() as string);
  if (!setupTokenValid(String(formData.get("token") ?? ""))) fail("/admin/setup", "Incorrect setup token.");
  const name = text(formData, "name", 80);
  const email = text(formData, "email", 200).toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!name) fail("/admin/setup", "Please enter your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) fail("/admin/setup", "Please enter a valid email.");
  if (password.length < 10) fail("/admin/setup", "Password must be at least 10 characters.");
  if (password !== String(formData.get("confirm") ?? "")) fail("/admin/setup", "Passwords do not match.");
  const r = getDb().prepare("INSERT INTO admins (email, name, password_hash, created_at) VALUES (?, ?, ?, ?)").run(email, name, hashPassword(password), Date.now());
  await createSession(Number(r.lastInsertRowid));
  redirect("/admin");
}

export async function loginAction(formData: FormData) {
  const email = text(formData, "email", 200).toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (loginBlocked(email)) fail("/admin/login", "Too many attempts. Try again in 15 minutes.");
  const row = getDb().prepare("SELECT id, password_hash FROM admins WHERE email = ?").get(email) as { id: number; password_hash: string } | undefined;
  // Same message whether the email or the password is wrong.
  if (!row || !verifyPassword(password, row.password_hash)) {
    recordFailure(email);
    fail("/admin/login", "Incorrect email or password.");
  } else {
    clearFailures(email);
    await createSession(row.id);
    redirect("/admin");
  }
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- Products ----------
export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id", 60);
  const back = id ? `/admin/products/${id}` : "/admin/products/new";
  const name = text(formData, "name", 160);
  const category = text(formData, "category", 40);
  const price = Number(formData.get("price"));
  const originalRaw = text(formData, "original_price", 20);
  const original = originalRaw === "" ? null : Number(originalRaw);
  const stock = Number(formData.get("stock"));
  const status = text(formData, "status", 10) === "draft" ? "draft" : "active";

  if (!name) fail(back, "Product name is required.");
  if (!(previewCategories as readonly string[]).includes(category)) fail(back, "Please choose a category.");
  if (!Number.isFinite(price) || price < 0) fail(back, "Enter a valid price.");
  if (original !== null && (!Number.isFinite(original) || original < 0)) fail(back, "Enter a valid original price.");
  if (!Number.isInteger(stock) || stock < 0) fail(back, "Stock must be a whole number, 0 or more.");

  let image = text(formData, "current_image", 300);
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const saved = await saveUpload(file);
    if ("error" in saved) fail(back, saved.error);
    else image = saved.path;
  }
  const input: ProductInput = { name, category, image, price, original_price: original, stock, status };

  if (id) {
    if (!getProduct(id)) fail("/admin/products", "Product not found.");
    updateProduct(id, input);
  } else {
    createProduct(input);
  }
  refreshShop();
  redirect("/admin/products?saved=1");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  deleteProduct(text(formData, "id", 60));
  refreshShop();
  redirect("/admin/products?saved=1");
}

// ---------- Customers ----------
export async function saveCustomerAction(formData: FormData) {
  await requireAdmin();
  const idRaw = text(formData, "id", 12);
  const back = idRaw ? `/admin/customers/${idRaw}` : "/admin/customers/new";
  const c = { name: text(formData, "name", 120), email: text(formData, "email", 200), phone: text(formData, "phone", 40), address: text(formData, "address", 300) };
  if (!c.name) fail(back, "Customer name is required.");
  if (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email)) fail(back, "Enter a valid email or leave it empty.");
  if (idRaw) updateCustomer(Number(idRaw), c);
  else createCustomer(c);
  redirect("/admin/customers?saved=1");
}

export async function deleteCustomerAction(formData: FormData) {
  await requireAdmin();
  deleteCustomer(Number(text(formData, "id", 12)));
  redirect("/admin/customers?saved=1");
}

// ---------- Orders ----------
export async function createOrderAction(formData: FormData) {
  await requireAdmin();
  const back = "/admin/orders/new";
  const productIds = formData.getAll("productId").map(String);
  const qtys = formData.getAll("qty").map(Number);
  const merged = new Map<string, number>();
  productIds.forEach((pid, i) => {
    const q = qtys[i];
    if (pid && Number.isInteger(q) && q > 0) merged.set(pid, (merged.get(pid) ?? 0) + q);
  });
  if (merged.size === 0) fail(back, "Add at least one product with a quantity.");

  const customerId = Number(text(formData, "customer_id", 12)) || null;
  let name = text(formData, "customer_name", 120);
  let phone = text(formData, "customer_phone", 40);
  if (customerId) {
    const row = getDb().prepare("SELECT name, phone FROM customers WHERE id = ?").get(customerId) as { name: string; phone: string } | undefined;
    if (row) { name = name || row.name; phone = phone || row.phone; }
  }
  if (!name) fail(back, "Choose a customer or type a customer name.");

  let orderId = 0;
  try {
    orderId = createOrder({
      customer_id: customerId, customer_name: name, customer_phone: phone, note: text(formData, "note", 500),
      items: [...merged].map(([productId, qty]) => ({ productId, qty })),
    });
  } catch (e) {
    fail(back, e instanceof Error ? e.message : "Could not create the order.");
  }
  refreshShop();
  redirect(`/admin/orders/${orderId}?saved=1`);
}

export async function setOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const id = Number(text(formData, "id", 12));
  const status = text(formData, "status", 20) as OrderStatus;
  if (!(ORDER_STATUSES as readonly string[]).includes(status)) fail(`/admin/orders/${id}`, "Invalid status.");
  try {
    setOrderStatus(id, status);
  } catch (e) {
    fail(`/admin/orders/${id}`, e instanceof Error ? e.message : "Could not update the order.");
  }
  refreshShop();
  redirect(`/admin/orders/${id}?saved=1`);
}

// ---------- Settings ----------
export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  const values: Record<string, string> = {};
  for (const key of SETTING_KEYS) values[key] = text(formData, key, key === "description" ? 300 : key === "bankDetails" ? 800 : 500);
  const gst = Number(values.gstRate);
  if (!Number.isFinite(gst) || gst < 0 || gst > 100) fail("/admin/settings", "GST rate must be between 0 and 100.");
  const fee = Number(values.deliveryFee === "" ? "0" : values.deliveryFee);
  if (!Number.isFinite(fee) || fee < 0) fail("/admin/settings", "Delivery fee must be 0 or more.");
  values.deliveryFee = String(fee);
  if (!values.name) fail("/admin/settings", "Shop name is required.");
  // Links open in new tabs, so only allow web links (blocks javascript: URLs).
  for (const k of ["instagram", "facebook", "tiktok", "whatsapp", "mapEmbedUrl"]) {
    if (values[k] && !/^https:\/\//i.test(values[k])) fail("/admin/settings", `${k}: links must start with https://`);
  }
  saveSettings(values);
  refreshShop();
  redirect("/admin/settings?saved=1");
}
