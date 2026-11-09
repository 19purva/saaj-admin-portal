"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CloudArrowUp, Eye, EyeSlash, PencilSimple, Trash, Images } from "@phosphor-icons/react";
import { Badge, Button, Card, DeleteConfirmModal, EmptyState, IconButton, Input, Modal, Textarea, Toggle, useToast } from "@/components/ui";
import { PageHeader } from "@/components/dashboard";
import { usePageHeader } from "@/hooks/usePageHeader";
import { api, uploadImages, type PortfolioItem } from "@/lib/api";

const titleFromName = (n: string) => n.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "Untitled";

export default function PortfolioPage() {
  usePageHeader({ title: "Portfolio" });
  const { toast } = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<PortfolioItem[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [toDelete, setToDelete] = useState<PortfolioItem | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api<PortfolioItem[]>("/admin/portfolio").then(setItems).catch((e) => toast(e.message, "error"));
  }, [toast]);
  useEffect(load, [load]);

  async function bulkUpload(files: FileList) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    setUploading(true);
    try {
      // upload in batches of 10 (API limit)
      for (let i = 0; i < list.length; i += 10) {
        const batch = list.slice(i, i + 10);
        const uploaded = await uploadImages(batch, "portfolio");
        await Promise.all(
          uploaded.map((img, j) => api("/admin/portfolio", { method: "POST", json: { title: titleFromName(batch[j].name), image: img, order: (items?.length ?? 0) + i + j } })),
        );
      }
      toast(`${list.length} photo${list.length > 1 ? "s" : ""} added`, "success");
      load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      const { title, caption, category, visible, order } = editing;
      await api(`/admin/portfolio/${editing._id}`, { method: "PUT", json: { title, caption, category, visible, order } });
      toast("Saved", "success");
      setEditing(null);
      load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisible(it: PortfolioItem) {
    await api(`/admin/portfolio/${it._id}`, { method: "PUT", json: { visible: !it.visible } }).catch((e) => toast(e.message, "error"));
    load();
  }

  async function remove() {
    if (!toDelete) return;
    try {
      await api(`/admin/portfolio/${toDelete._id}`, { method: "DELETE" });
      toast("Photo deleted", "success");
      setToDelete(null);
      load();
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio"
        description="Showcase work that isn’t necessarily for sale. Select many photos at once."
        actions={<Button loading={uploading} leftIcon={<CloudArrowUp size={18} />} onClick={() => input.current?.click()}>Upload photos</Button>}
      />
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files) bulkUpload(e.target.files); e.target.value = ""; }} />

      {items && items.length === 0 ? (
        <Card><EmptyState icon={<Images size={32} />} title="No portfolio photos" description="Upload photos of your finished work." /></Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {(items ?? []).map((it) => (
            <div key={it._id} className="group overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative aspect-square bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image.url} alt={it.title} className={`h-full w-full object-cover ${it.visible ? "" : "opacity-40"}`} />
                {!it.visible && <Badge className="absolute left-2 top-2" variant="neutral">Hidden</Badge>}
              </div>
              <div className="flex items-center justify-between gap-1 p-3">
                <p className="truncate text-sm font-medium">{it.title}</p>
                <div className="flex shrink-0">
                  <IconButton aria-label={it.visible ? "Hide" : "Show"} icon={it.visible ? <Eye size={16} /> : <EyeSlash size={16} />} onClick={() => toggleVisible(it)} />
                  <IconButton aria-label="Edit" icon={<PencilSimple size={16} />} onClick={() => setEditing(it)} />
                  <IconButton aria-label="Delete" icon={<Trash size={16} />} onClick={() => setToDelete(it)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit photo" size="sm">
        {editing && (
          <>
            <div className="space-y-4 p-6">
              <Input label="Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              <Input label="Category" optional placeholder="e.g. Weddings" value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              <Textarea label="Caption" optional rows={3} value={editing.caption ?? ""} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} />
              <Input label="Order" type="number" value={String(editing.order)} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
              <Toggle label="Visible" checked={editing.visible} onChange={(v) => setEditing({ ...editing, visible: v })} />
            </div>
            <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button loading={saving} onClick={save}>Save</Button>
            </div>
          </>
        )}
      </Modal>
      <DeleteConfirmModal open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={remove} itemName={toDelete?.title} />
    </div>
  );
}
