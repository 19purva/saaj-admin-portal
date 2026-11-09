"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Skeleton, Textarea, useToast } from "@/components/ui";
import { PageHeader } from "@/components/dashboard";
import { ImageUploader } from "@/components/features/ImageUploader";
import { usePageHeader } from "@/hooks/usePageHeader";
import { api } from "@/lib/api";

interface SettingsData {
  siteTitle: string;
  tagline: string;
  heroHeadline: string;
  heroSub: string;
  heroImage?: string;
  announcement: string;
  instagram: string;
  whatsapp: string;
  email: string;
  shippingFee: number;
  freeShippingAbove: number;
}

export default function SettingsPage() {
  usePageHeader({ title: "Settings" });
  const { toast } = useToast();
  const [s, setS] = useState<SettingsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [pwBusy, setPwBusy] = useState(false);

  useEffect(() => {
    api<SettingsData>("/settings").then(setS).catch((e) => toast(e.message, "error"));
  }, [toast]);

  if (!s) return <Skeleton className="h-96 rounded-2xl" />;
  const set = <K extends keyof SettingsData>(k: K, v: SettingsData[K]) => setS({ ...s, [k]: v });

  async function save() {
    setSaving(true);
    try {
      await api("/admin/settings", { method: "PUT", json: s });
      toast("Settings saved — the storefront updates within a minute", "success");
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    setPwBusy(true);
    try {
      await api("/auth/change-password", { method: "POST", json: pw });
      toast("Password changed", "success");
      setPw({ currentPassword: "", newPassword: "" });
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setPwBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Site text, hero, shipping and contact details." actions={<Button loading={saving} onClick={save}>Save changes</Button>} />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Homepage</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input label="Announcement bar" optional value={s.announcement} onChange={(e) => set("announcement", e.target.value)} />
            <Input label="Hero headline" value={s.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} />
            <Textarea label="Hero subtext" rows={2} value={s.heroSub} onChange={(e) => set("heroSub", e.target.value)} />
            <div>
              <p className="mb-2 text-sm font-medium">Hero image</p>
              <ImageUploader value={s.heroImage ? [{ url: s.heroImage }] : []} onChange={(v) => set("heroImage", v[0]?.url)} folder="site" max={1} className="max-w-52" />
            </div>
            <Input label="Site title" value={s.siteTitle} onChange={(e) => set("siteTitle", e.target.value)} />
            <Input label="Tagline" value={s.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Contact & social</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input label="Instagram URL" value={s.instagram} onChange={(e) => set("instagram", e.target.value)} />
              <Input label="WhatsApp number" optional placeholder="919876543210" value={s.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
              <Input label="Email" optional type="email" value={s.email} onChange={(e) => set("email", e.target.value)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Shipping</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Input label="Shipping fee (₹)" type="number" min={0} value={String(s.shippingFee)} onChange={(e) => set("shippingFee", Number(e.target.value))} />
              <Input label="Free shipping above (₹)" type="number" min={0} value={String(s.freeShippingAbove)} onChange={(e) => set("freeShippingAbove", Number(e.target.value))} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Change password</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input label="Current password" type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} autoComplete="current-password" />
              <Input label="New password (min 8 characters)" type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} autoComplete="new-password" />
              <Button variant="outline" loading={pwBusy} onClick={changePassword} disabled={pw.newPassword.length < 8}>Update password</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
