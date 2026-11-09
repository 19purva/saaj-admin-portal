"use client";

import { useCallback, useEffect, useState } from "react";
import { MagnifyingGlass, ShoppingBag } from "@phosphor-icons/react";
import { Badge, Button, Card, Drawer, EmptyState, Input, Select, Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Textarea, useToast } from "@/components/ui";
import { PageHeader, Pagination } from "@/components/dashboard";
import { usePageHeader } from "@/hooks/usePageHeader";
import { api, fmtDate, inr, type Order, type OrderStatus, type Paged } from "@/lib/api";
import { statusOptions, statusVariant } from "@/lib/status";

export default function OrdersPage() {
  usePageHeader({ title: "Orders" });
  const { toast } = useToast();
  const [data, setData] = useState<Paged<Order> | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState<Order | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api<Paged<Order>>(`/admin/orders?page=${page}&limit=10&status=${status}&q=${encodeURIComponent(search)}`).then(setData).catch((e) => toast(e.message, "error"));
  }, [page, status, search, toast]);
  useEffect(load, [load]);

  async function save() {
    if (!sel) return;
    setSaving(true);
    try {
      await api(`/admin/orders/${sel._id}`, { method: "PATCH", json: { status: sel.status, paymentStatus: sel.paymentStatus, trackingNote: sel.trackingNote ?? "" } });
      toast("Order updated", "success");
      setSel(null);
      load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Confirm, ship and track customer orders." />

      <div className="flex flex-col gap-3 sm:flex-row">
        <form className="flex-1 sm:max-w-sm" onSubmit={(e) => { e.preventDefault(); setPage(1); setSearch(q); }}>
          <Input placeholder="Search order #, name or phone…" value={q} onChange={(e) => setQ(e.target.value)} leftIcon={<MagnifyingGlass size={18} />} />
        </form>
        <Select aria-label="Filter by status" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }} placeholder="All statuses" options={statusOptions} />
      </div>

      <Card>
        {!data ? (
          <div className="space-y-3 p-5">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : data.items.length === 0 ? (
          <EmptyState icon={<ShoppingBag size={32} />} title="No orders found" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead><TableHead>Payment</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Total</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((o) => (
                <TableRow key={o._id} onClick={() => setSel(o)} className="cursor-pointer">
                  <TableCell className="font-medium">{o.orderNumber}</TableCell>
                  <TableCell>{o.customer.name}<span className="block text-xs text-muted">{o.customer.phone}</span></TableCell>
                  <TableCell>{fmtDate(o.createdAt)}</TableCell>
                  <TableCell><Badge variant={o.paymentStatus === "paid" ? "green" : o.paymentStatus === "failed" ? "red" : "amber"} className="uppercase">{o.paymentMethod} · {o.paymentStatus}</Badge></TableCell>
                  <TableCell><Badge variant={statusVariant[o.status]} className="capitalize">{o.status}</Badge></TableCell>
                  <TableCell className="text-right tabular-nums">{inr(o.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
      {data && data.pages > 1 && <Pagination page={data.page} totalPages={data.pages} onPageChange={setPage} />}

      <Drawer
        open={!!sel}
        onClose={() => setSel(null)}
        title={sel ? `Order ${sel.orderNumber}` : ""}
        width="lg"
        className="max-w-full"
        footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setSel(null)}>Close</Button><Button loading={saving} onClick={save}>Save changes</Button></div>}
      >
        {sel && (
          <div className="space-y-6 p-6 text-sm">
            <section>
              <h3 className="mb-2 font-medium">Items</h3>
              <ul className="space-y-3">
                {sel.items.map((i, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {i.image ? <img src={i.image} alt="" className="h-12 w-12 rounded-lg object-cover" /> : <div className="h-12 w-12 rounded-lg bg-surface" />}
                    <span className="flex-1">{i.title} <span className="text-muted">× {i.qty}</span></span>
                    <span className="tabular-nums">{inr(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-1 border-t border-border pt-3 tabular-nums">
                <div className="flex justify-between"><span className="text-muted">Subtotal</span>{inr(sel.subtotal)}</div>
                <div className="flex justify-between"><span className="text-muted">Shipping</span>{inr(sel.shipping)}</div>
                <div className="flex justify-between font-medium"><span>Total</span>{inr(sel.total)}</div>
              </div>
            </section>
            <section>
              <h3 className="mb-2 font-medium">Customer</h3>
              <p>{sel.customer.name}</p>
              <p><a className="text-indigo-600" href={`tel:${sel.customer.phone}`}>{sel.customer.phone}</a>{sel.customer.email && <> · {sel.customer.email}</>}</p>
              <p className="mt-2 text-muted">
                {sel.address.line1}{sel.address.line2 && `, ${sel.address.line2}`}<br />{sel.address.city}, {sel.address.state} {sel.address.pincode}
              </p>
              {sel.notes && <p className="mt-2 rounded-lg bg-surface p-3">“{sel.notes}”</p>}
            </section>
            <section className="space-y-4">
              <Select label="Order status" value={sel.status} onChange={(e) => setSel({ ...sel, status: e.target.value as OrderStatus })} options={statusOptions} />
              <Select label="Payment status" value={sel.paymentStatus} onChange={(e) => setSel({ ...sel, paymentStatus: e.target.value as Order["paymentStatus"] })} options={[{ label: "Pending", value: "pending" }, { label: "Paid", value: "paid" }, { label: "Failed", value: "failed" }]} />
              <Textarea label="Tracking note (visible to customer)" rows={3} placeholder="e.g. Shipped via India Post, tracking no. XX123" value={sel.trackingNote ?? ""} onChange={(e) => setSel({ ...sel, trackingNote: e.target.value })} />
            </section>
          </div>
        )}
      </Drawer>
    </div>
  );
}
