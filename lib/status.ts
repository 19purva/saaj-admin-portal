import type { OrderStatus } from "./api";

export const statusVariant: Record<OrderStatus, "amber" | "blue" | "violet" | "green" | "red"> = {
  pending: "amber",
  confirmed: "blue",
  shipped: "violet",
  delivered: "green",
  cancelled: "red",
};

export const statusOptions = (["pending", "confirmed", "shipped", "delivered", "cancelled"] as const).map((s) => ({
  label: s[0].toUpperCase() + s.slice(1),
  value: s,
}));
