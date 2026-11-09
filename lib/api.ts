export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
export const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL ?? "http://localhost:3000";
const TOKEN_KEY = "saaj-admin-token";

export const token = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (t: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, t);
    } catch {
      /* ignore */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const t = token.get();
  if (t) headers.set("Authorization", `Bearer ${t}`);
  let body = init.body;
  if (init.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(init.json);
  }
  const res = await fetch(`${API_URL}${path}`, { ...init, headers, body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined" && !path.startsWith("/auth/login")) {
      token.clear();
      window.location.href = "/login";
    }
    throw new ApiError((data as { error?: string }).error ?? "Request failed", res.status);
  }
  return data as T;
}

export async function uploadImages(files: File[], folder: string) {
  const fd = new FormData();
  files.forEach((f) => fd.append("images", f));
  return api<{ url: string; publicId: string }[]>(`/admin/uploads?folder=${folder}`, { method: "POST", body: fd });
}

// ---------- Types ----------
export interface Img { url: string; publicId?: string }
export interface Category { _id: string; name: string; slug: string; image?: Img; order: number }
export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  category?: { _id: string; name: string } | string | null;
  tags: string[];
  images: Img[];
  customizable?: boolean;
  featured: boolean;
  active: boolean;
}
export interface PortfolioItem { _id: string; title: string; caption?: string; category?: string; image: Img; order: number; visible: boolean }
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export interface Order {
  _id: string;
  orderNumber: string;
  customer: { name: string; phone: string; email?: string };
  address: { line1: string; line2?: string; city: string; state: string; pincode: string };
  items: { title: string; price: number; qty: number; image?: string }[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "cod" | "razorpay";
  paymentStatus: "pending" | "paid" | "failed";
  status: OrderStatus;
  trackingNote?: string;
  notes?: string;
  createdAt: string;
}
export interface Enquiry {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  type: "contact" | "custom";
  interest?: string;
  occasion?: string;
  referenceImage?: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}
export interface Paged<T> { items: T[]; total: number; page: number; pages: number }
export interface Stats {
  revenue: number;
  orders: number;
  pending: number;
  products: number;
  lowStock: { _id: string; title: string; stock: number }[];
  daily: { _id: string; revenue: number; orders: number }[];
  recent: Order[];
}

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
export const fmtDate = (d: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));
