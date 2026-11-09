"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CurrencyInr, ShoppingBag, Clock, Package } from "@phosphor-icons/react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, Card, CardContent, CardHeader, CardTitle, Skeleton } from "@/components/ui";
import { PageHeader, StatCard } from "@/components/dashboard";
import { usePageHeader } from "@/hooks/usePageHeader";
import { api, fmtDate, inr, type Stats } from "@/lib/api";
import { statusVariant } from "@/lib/status";

export default function Overview() {
  usePageHeader({ title: "Overview" });
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Stats>("/admin/stats").then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-sm text-red-500">Could not load stats: {error}</p>;

  return (
    <div className="space-y-6">
      <PageHeader title="Welcome back" description="Here’s how the shop is doing." />

      {!stats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={<CurrencyInr size={22} />} label="Revenue" value={inr(stats.revenue)} href="/dashboard/orders" />
            <StatCard icon={<ShoppingBag size={22} />} label="Orders" value={String(stats.orders)} href="/dashboard/orders" />
            <StatCard icon={<Clock size={22} />} label="Pending orders" value={String(stats.pending)} href="/dashboard/orders" />
            <StatCard icon={<Package size={22} />} label="Products" value={String(stats.products)} href="/dashboard/products" />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader><CardTitle>Sales — last 30 days</CardTitle></CardHeader>
              <CardContent>
                {stats.daily.length === 0 ? (
                  <p className="py-16 text-center text-sm text-muted">No orders in the last 30 days yet.</p>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.daily}>
                        <defs>
                          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#722f37" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#722f37" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                        <XAxis dataKey="_id" tickFormatter={(d: string) => d.slice(5)} stroke="var(--chart-muted)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--chart-muted)" fontSize={12} tickLine={false} axisLine={false} width={50} />
                        <Tooltip formatter={(v) => inr(Number(v))} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                        <Area type="monotone" dataKey="revenue" stroke="#722f37" strokeWidth={2} fill="url(#rev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Low stock</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {stats.lowStock.length === 0 && <p className="text-sm text-muted">Everything is well stocked.</p>}
                {stats.lowStock.map((p) => (
                  <div key={p._id} className="flex items-center justify-between text-sm">
                    <span className="truncate pr-3">{p.title}</span>
                    <Badge variant={p.stock === 0 ? "red" : "amber"}>{p.stock === 0 ? "Sold out" : `${p.stock} left`}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Recent orders</CardTitle></CardHeader>
            <CardContent className="divide-y divide-border">
              {stats.recent.length === 0 && <p className="py-6 text-center text-sm text-muted">No orders yet.</p>}
              {stats.recent.map((o) => (
                <Link key={o._id} href="/dashboard/orders" className="flex items-center justify-between gap-3 py-3 text-sm hover:opacity-80">
                  <div>
                    <p className="font-medium">{o.orderNumber} · {o.customer.name}</p>
                    <p className="text-xs text-muted">{fmtDate(o.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusVariant[o.status]} className="capitalize">{o.status}</Badge>
                    <span className="w-20 text-right tabular-nums">{inr(o.total)}</span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
