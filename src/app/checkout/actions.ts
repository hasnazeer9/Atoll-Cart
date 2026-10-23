"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createOrder, findOrCreateCustomer, getOrder, getProduct } from "@/lib/data";
import { getSettings } from "@/lib/settings";

export type CheckoutState = { error?: string; values?: Record<string, string> };

const clean = (f: FormData, k: string, max: number) => String(f.get(k) ?? "").trim().slice(0, max);

// Basic spam brake: 3 orders per phone number per 10 minutes.
const recent = new Map<string, number[]>();
function tooManyOrders(phone: string): boolean {
  const now = Date.now();
  const times = (recent.get(phone) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.set(phone, times);
  return times.length >= 3;
}

export async function placeOrderAction(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const values = {
    name: clean(formData, "name", 120),
    phone: clean(formData, "phone", 30),
    email: clean(formData, "email", 200),
    address: clean(formData, "address", 300),
    note: clean(formData, "note", 500),
    payment: clean(formData, "payment", 10),
  };
  const bad = (error: string): CheckoutState => ({ error, values });

  // Hidden trap field: real people leave it empty, simple bots fill it in.
  if (clean(formData, "website", 100)) return bad("Something went wrong. Please try again.");

  if (values.name.length < 2) return bad("Please enter your name.");
  if (!/^\+?[\d\s-]{7,20}$/.test(values.phone)) return bad("Please enter a valid phone number.");
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) return bad("Please enter a valid email, or leave it empty.");
  if (values.address.length < 5) return bad("Please enter your delivery address (island and house or street).");

  const settings = getSettings();
  const allowed = settings.bankDetails ? ["cod", "bank"] : ["cod"];
  if (!allowed.includes(values.payment)) return bad("Please choose a payment method.");

  // The cart comes from the browser, so treat it as untrusted: only ids and
  // quantities are used. Names and prices always come from the database.
  let lines: { id: string; qty: number }[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("cart") ?? "[]"));
    if (Array.isArray(parsed)) {
      lines = parsed
        .filter((l) => l && typeof l.id === "string" && Number.isInteger(l.qty) && l.qty > 0 && l.qty <= 99)
        .slice(0, 50)
        .map((l) => ({ id: l.id, qty: l.qty }));
    }
  } catch {
    // fall through to the empty-cart message
  }
  if (lines.length === 0) return bad("Your cart is empty.");
  for (const l of lines) {
    const p = getProduct(l.id);
    if (!p || p.status !== "active") return bad("An item in your cart is no longer available. Please review your cart.");
  }

  const phoneKey = values.phone.replace(/\D/g, "");
  if (tooManyOrders(phoneKey)) return bad("Too many orders from this phone number. Please wait a few minutes.");

  let orderId = 0;
  try {
    const customerId = findOrCreateCustomer({ name: values.name, email: values.email, phone: values.phone, address: values.address });
    orderId = createOrder({
      customer_id: customerId,
      customer_name: values.name,
      customer_phone: values.phone,
      email: values.email,
      address: values.address,
      payment_method: values.payment === "bank" ? "bank" : "cod",
      delivery_fee: settings.deliveryFee,
      note: values.note,
      items: lines.map((l) => ({ productId: l.id, qty: l.qty })),
    });
  } catch (e) {
    return bad(e instanceof Error ? e.message : "Could not place your order. Please try again.");
  }

  recent.set(phoneKey, [...(recent.get(phoneKey) ?? []), Date.now()]);
  revalidatePath("/", "layout");
  const code = getOrder(orderId)?.order.public_code;
  redirect(`/order/${code}?placed=1`);
}
