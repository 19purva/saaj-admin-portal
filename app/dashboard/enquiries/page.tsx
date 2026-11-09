"use client";

import { useCallback, useEffect, useState } from "react";
import { EnvelopeSimple, Trash, CheckCircle } from "@phosphor-icons/react";
import { Badge, Button, Card, DeleteConfirmModal, EmptyState, Skeleton, useToast } from "@/components/ui";
import { PageHeader } from "@/components/dashboard";
import { usePageHeader } from "@/hooks/usePageHeader";
import { api, fmtDate, type Enquiry } from "@/lib/api";

const variant = { new: "amber", read: "blue", replied: "green" } as const;

export default function EnquiriesPage() {
  usePageHeader({ title: "Enquiries" });
  const { toast } = useToast();
  const [items, setItems] = useState<Enquiry[] | null>(null);
  const [toDelete, setToDelete] = useState<Enquiry | null>(null);

  const load = useCallback(() => {
    api<Enquiry[]>("/admin/enquiries").then(setItems).catch((e) => toast(e.message, "error"));
  }, [toast]);
  useEffect(load, [load]);

  async function setStatus(e: Enquiry, status: Enquiry["status"]) {
    await api(`/admin/enquiries/${e._id}`, { method: "PATCH", json: { status } }).catch((err) => toast(err.message, "error"));
    load();
  }

  async function remove() {
    if (!toDelete) return;
    await api(`/admin/enquiries/${toDelete._id}`, { method: "DELETE" }).catch((err) => toast(err.message, "error"));
    setToDelete(null);
    toast("Deleted", "success");
    load();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Enquiries" description="Contact messages and custom-order requests." />
      {!items ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
      ) : items.length === 0 ? (
        <Card><EmptyState icon={<EnvelopeSimple size={32} />} title="Inbox is empty" /></Card>
      ) : (
        <div className="space-y-4">
          {items.map((e) => (
            <Card key={e._id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{e.name} <Badge variant={e.type === "custom" ? "indigo" : "neutral"} className="ml-2">{e.type === "custom" ? "Custom order" : "Contact"}</Badge></p>
                  <p className="text-xs text-muted">
                    {fmtDate(e.createdAt)}
                    {e.email && <> · <a className="text-indigo-600" href={`mailto:${e.email}`}>{e.email}</a></>}
                    {e.phone && <> · <a className="text-indigo-600" href={`https://wa.me/${e.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">{e.phone}</a></>}
                  </p>
                </div>
                <Badge variant={variant[e.status]} className="capitalize">{e.status}</Badge>
              </div>
              {(e.interest || e.occasion) && (
                <p className="mt-3 flex flex-wrap gap-2 text-xs">
                  {e.interest && <Badge variant="indigo">{e.interest}</Badge>}
                  {e.occasion && <Badge variant="neutral">{e.occasion}</Badge>}
                </p>
              )}
              <p className="mt-3 whitespace-pre-line text-sm">{e.message}</p>
              {e.referenceImage && (
                <a href={e.referenceImage} target="_blank" rel="noreferrer" className="mt-3 inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={e.referenceImage} alt="Reference" className="h-28 rounded-xl object-cover" />
                </a>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {e.status !== "read" && e.status !== "replied" && <Button size="sm" variant="outline" onClick={() => setStatus(e, "read")}>Mark read</Button>}
                {e.status !== "replied" && <Button size="sm" variant="outline" leftIcon={<CheckCircle size={16} />} onClick={() => setStatus(e, "replied")}>Mark replied</Button>}
                <Button size="sm" variant="ghost" leftIcon={<Trash size={16} />} onClick={() => setToDelete(e)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <DeleteConfirmModal open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={remove} itemName={toDelete ? `message from ${toDelete.name}` : undefined} />
    </div>
  );
}
