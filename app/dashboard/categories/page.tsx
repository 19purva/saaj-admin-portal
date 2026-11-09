"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, PencilSimple, Trash, Tag } from "@phosphor-icons/react";
import { Button, Card, DeleteConfirmModal, EmptyState, IconButton, Input, Modal, useToast } from "@/components/ui";
import { PageHeader } from "@/components/dashboard";
import { ImageUploader } from "@/components/features/ImageUploader";
import { usePageHeader } from "@/hooks/usePageHeader";
import { api, type Category, type Img } from "@/lib/api";

export default function CategoriesPage() {
  usePageHeader({ title: "Categories" });
  const { toast } = useToast();
  const [items, setItems] = useState<Category[] | null>(null);
  const [editing, setEditing] = useState<Category | "new" | null>(null);
  const [name, setName] = useState("");
  const [order, setOrder] = useState("0");
  const [images, setImages] = useState<Img[]>([]);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Category | null>(null);

  const load = useCallback(() => {
    api<Category[]>("/admin/categories").then(setItems).catch((e) => toast(e.message, "error"));
  }, [toast]);
  useEffect(load, [load]);

  function open(c: Category | "new") {
    setEditing(c);
    setName(c === "new" ? "" : c.name);
    setOrder(c === "new" ? String(items?.length ?? 0) : String(c.order));
    setImages(c === "new" || !c.image ? [] : [c.image]);
  }

  async function save() {
    if (!name.trim()) return toast("Name is required", "error");
    setSaving(true);
    const body = { name: name.trim(), order: Number(order) || 0, image: images[0] ?? null };
    try {
      if (editing === "new") await api("/admin/categories", { method: "POST", json: body });
      else if (editing) await api(`/admin/categories/${editing._id}`, { method: "PUT", json: body });
      toast("Saved", "success");
      setEditing(null);
      load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!toDelete) return;
    try {
      await api(`/admin/categories/${toDelete._id}`, { method: "DELETE" });
      toast("Category deleted", "success");
      setToDelete(null);
      load();
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Categories" description="Group products so customers can filter the shop." actions={<Button leftIcon={<Plus size={18} weight="bold" />} onClick={() => open("new")}>Add category</Button>} />
      <Card>
        {items && items.length === 0 ? (
          <EmptyState icon={<Tag size={32} />} title="No categories" description="Create categories like Crochet, Resin Art, Candles…" />
        ) : (
          <ul className="divide-y divide-border">
            {(items ?? []).map((c) => (
              <li key={c._id} className="flex items-center gap-4 px-5 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {c.image ? <img src={c.image.url} alt="" className="h-12 w-12 rounded-lg object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface text-muted"><Tag size={20} /></div>}
                <div className="flex-1">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted">/{c.slug}</p>
                </div>
                <IconButton aria-label="Edit" icon={<PencilSimple size={18} />} onClick={() => open(c)} />
                <IconButton aria-label="Delete" icon={<Trash size={18} />} onClick={() => setToDelete(c)} />
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "New category" : "Edit category"} size="sm">
        <div className="space-y-4 p-6">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Display order" type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
          <div>
            <p className="mb-2 text-sm font-medium">Image <span className="text-muted">(optional)</span></p>
            <ImageUploader value={images} onChange={setImages} folder="categories" max={1} />
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          <Button loading={saving} onClick={save}>Save</Button>
        </div>
      </Modal>
      <DeleteConfirmModal open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={remove} itemName={toDelete?.name} description="Products in this category will become uncategorised." />
    </div>
  );
}
