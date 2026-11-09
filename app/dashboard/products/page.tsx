"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, PencilSimple, Trash, Package, MagnifyingGlass } from "@phosphor-icons/react";
import {
  Badge, Button, Card, DeleteConfirmModal, Drawer, EmptyState, Input, Select, Skeleton, Table, TableBody,
  TableCell, TableHead, TableHeader, TableRow, Textarea, Toggle, ActionMenu, useToast,
} from "@/components/ui";
import { PageHeader, Pagination } from "@/components/dashboard";
import { ImageUploader } from "@/components/features/ImageUploader";
import { usePageHeader } from "@/hooks/usePageHeader";
import { api, inr, type Category, type Img, type Paged, type Product } from "@/lib/api";

interface Form {
  title: string;
  description: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  category: string;
  tags: string;
  images: Img[];
  featured: boolean;
  customizable: boolean;
  active: boolean;
}

const empty: Form = { title: "", description: "", price: "", compareAtPrice: "", stock: "1", category: "", tags: "", images: [], featured: false, customizable: false, active: true };
const catId = (c: Product["category"]) => (typeof c === "object" && c ? c._id : (c ?? ""));

export default function ProductsPage() {
  usePageHeader({ title: "Products" });
  const { toast } = useToast();
  const [data, setData] = useState<Paged<Product> | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const load = useCallback(() => {
    api<Paged<Product>>(`/admin/products?page=${page}&limit=10&q=${encodeURIComponent(search)}`).then(setData).catch((e) => toast(e.message, "error"));
  }, [page, search, toast]);

  useEffect(load, [load]);
  useEffect(() => { api<Category[]>("/admin/categories").then(setCats).catch(() => {}); }, []);

  function open(p: Product | "new") {
    setEditing(p);
    setForm(
      p === "new"
        ? empty
        : { title: p.title, description: p.description, price: String(p.price), compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : "", stock: String(p.stock), category: catId(p.category), tags: p.tags.join(", "), images: p.images, featured: p.featured, customizable: !!p.customizable, active: p.active },
    );
  }

  async function save() {
    if (!form.title.trim() || form.price === "") return toast("Title and price are required", "error");
    setSaving(true);
    const body = {
      title: form.title.trim(),
      description: form.description,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stock: Number(form.stock || 0),
      category: form.category || null,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      images: form.images,
      featured: form.featured,
      customizable: form.customizable,
      active: form.active,
    };
    try {
      if (editing === "new") await api("/admin/products", { method: "POST", json: body });
      else if (editing) await api(`/admin/products/${editing._id}`, { method: "PUT", json: body });
      toast(editing === "new" ? "Product created" : "Product saved", "success");
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
      await api(`/admin/products/${toDelete._id}`, { method: "DELETE" });
      toast("Product deleted", "success");
      setToDelete(null);
      load();
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <PageHeader title="Products" description="Everything you sell, with photos stored on Cloudinary." actions={<Button leftIcon={<Plus size={18} weight="bold" />} onClick={() => open("new")}>Add product</Button>} />

      <form onSubmit={(e) => { e.preventDefault(); setPage(1); setSearch(q); }} className="max-w-sm">
        <Input placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} leftIcon={<MagnifyingGlass size={18} />} />
      </form>

      <Card>
        {!data ? (
          <div className="space-y-3 p-5">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-14" />)}</div>
        ) : data.items.length === 0 ? (
          <EmptyState icon={<Package size={32} />} title="No products yet" description="Add your first handmade piece." action={<Button onClick={() => open("new")}>Add product</Button>} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Status</TableHead><TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {p.images[0] ? <img src={p.images[0].url} alt="" className="h-11 w-11 rounded-lg object-cover" /> : <div className="h-11 w-11 rounded-lg bg-surface" />}
                      <span className="font-medium">{p.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{typeof p.category === "object" && p.category ? p.category.name : "—"}</TableCell>
                  <TableCell className="tabular-nums">{inr(p.price)}</TableCell>
                  <TableCell><Badge variant={p.stock === 0 ? "red" : p.stock <= 2 ? "amber" : "green"}>{p.stock}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      <Badge variant={p.active ? "green" : "neutral"}>{p.active ? "Active" : "Hidden"}</Badge>
                      {p.featured && <Badge variant="indigo">Featured</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ActionMenu items={[
                      { label: "Edit", icon: <PencilSimple size={16} />, onClick: () => open(p) },
                      { label: "Delete", icon: <Trash size={16} />, variant: "danger", onClick: () => setToDelete(p) },
                    ]} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
      {data && data.pages > 1 && <Pagination page={data.page} totalPages={data.pages} onPageChange={setPage} />}

      <Drawer
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "New product" : "Edit product"}
        width="lg"
        className="max-w-full"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button loading={saving} onClick={save}>Save product</Button>
          </div>
        }
      >
        <div className="space-y-5 p-6">
          <div>
            <p className="mb-2 text-sm font-medium">Photos</p>
            <ImageUploader value={form.images} onChange={(v) => set("images", v)} folder="products" />
            <p className="mt-2 text-xs text-muted">First photo is the cover. Hover a photo to reorder or remove.</p>
          </div>
          <Input label="Title" value={form.title} onChange={(e) => set("title", e.target.value)} />
          <Textarea label="Description" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (₹)" type="number" min={0} value={form.price} onChange={(e) => set("price", e.target.value)} />
            <Input label="Compare-at price (₹)" optional type="number" min={0} value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} />
            <Input label="Stock" type="number" min={0} value={form.stock} onChange={(e) => set("stock", e.target.value)} />
            <Select label="Category" value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="None" options={cats.map((c) => ({ label: c.name, value: c._id }))} />
          </div>
          <Input label="Tags" optional placeholder="gift, crochet, festive" value={form.tags} onChange={(e) => set("tags", e.target.value)} />
          <Toggle label="Active" description="Visible on the storefront" checked={form.active} onChange={(v) => set("active", v)} />
          <Toggle label="Customisable" description="Shows a request-customisation option to customers" checked={form.customizable} onChange={(v) => set("customizable", v)} />
          <Toggle label="Featured" description="Show on the home page" checked={form.featured} onChange={(v) => set("featured", v)} />
        </div>
      </Drawer>

      <DeleteConfirmModal open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={remove} itemName={toDelete?.title} />
    </div>
  );
}
