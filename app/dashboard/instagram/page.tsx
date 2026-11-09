"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowSquareOut, Eye, EyeSlash, InstagramLogo, Plus, Trash } from "@phosphor-icons/react";
import { Button, Card, DeleteConfirmModal, EmptyState, IconButton, Input, Skeleton, useToast } from "@/components/ui";
import { PageHeader } from "@/components/dashboard";
import { usePageHeader } from "@/hooks/usePageHeader";
import { api } from "@/lib/api";

interface IgPost {
  _id: string;
  url: string;
  note?: string;
  visible: boolean;
  order: number;
}

export default function InstagramPage() {
  usePageHeader({ title: "Instagram" });
  const { toast } = useToast();
  const [posts, setPosts] = useState<IgPost[] | null>(null);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState<IgPost | null>(null);

  const load = useCallback(() => {
    api<IgPost[]>("/admin/instagram-posts").then(setPosts).catch((e) => toast(e.message, "error"));
  }, [toast]);
  useEffect(load, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setAdding(true);
    try {
      await api("/admin/instagram-posts", { method: "POST", json: { url: url.trim(), note: note.trim() || undefined, order: posts?.length ?? 0 } });
      toast("Post added — it will appear on the website", "success");
      setUrl("");
      setNote("");
      load();
    } catch (err) {
      toast((err as Error).message, "error");
    } finally {
      setAdding(false);
    }
  }

  async function toggle(p: IgPost) {
    await api(`/admin/instagram-posts/${p._id}`, { method: "PATCH", json: { visible: !p.visible } }).catch((e) => toast(e.message, "error"));
    load();
  }

  async function remove() {
    if (!toDelete) return;
    await api(`/admin/instagram-posts/${toDelete._id}`, { method: "DELETE" }).catch((e) => toast(e.message, "error"));
    setToDelete(null);
    toast("Removed", "success");
    load();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Instagram posts" description="Show your Instagram posts and reels on the website. Paste a post link and it appears in the “From our Instagram” section." />

      <Card className="p-5">
        <form onSubmit={add} className="grid gap-4 md:grid-cols-[2fr_1fr_auto] md:items-end">
          <Input label="Post or reel link" placeholder="https://www.instagram.com/p/AbC123xyz/" value={url} onChange={(e) => setUrl(e.target.value)} />
          <Input label="Note" optional placeholder="e.g. Pipe cleaner bouquet" value={note} onChange={(e) => setNote(e.target.value)} />
          <Button type="submit" loading={adding} leftIcon={<Plus size={18} weight="bold" />}>Add post</Button>
        </form>
        <p className="mt-3 text-xs text-muted">
          On Instagram, open a post → tap the ⋯ menu → <b>Copy link</b>. Only public posts can be shown. Links to a profile page won’t work — it must be a single post or reel.
        </p>
      </Card>

      {!posts ? (
        <Skeleton className="h-32 rounded-2xl" />
      ) : posts.length === 0 ? (
        <Card><EmptyState icon={<InstagramLogo size={32} />} title="No posts added yet" description="Paste a link above to feature your pipe cleaner crafts and other work." /></Card>
      ) : (
        <Card>
          <ul className="divide-y divide-border">
            {posts.map((p) => (
              <li key={p._id} className="flex items-center gap-3 px-5 py-3">
                <InstagramLogo size={22} className={p.visible ? "text-indigo-600" : "text-muted"} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.note || p.url}</p>
                  <p className="truncate text-xs text-muted">{p.url}</p>
                </div>
                <a href={p.url} target="_blank" rel="noreferrer" aria-label="Open on Instagram" className="text-muted hover:text-foreground"><ArrowSquareOut size={18} /></a>
                <IconButton aria-label={p.visible ? "Hide" : "Show"} icon={p.visible ? <Eye size={18} /> : <EyeSlash size={18} />} onClick={() => toggle(p)} />
                <IconButton aria-label="Delete" icon={<Trash size={18} />} onClick={() => setToDelete(p)} />
              </li>
            ))}
          </ul>
        </Card>
      )}
      <DeleteConfirmModal open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={remove} itemName="this Instagram post" description="It is only removed from your website, not from Instagram." />
    </div>
  );
}
