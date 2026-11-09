"use client";

import { useRef, useState } from "react";
import { CloudArrowUp, X, Star } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { uploadImages, type Img } from "@/lib/api";
import { useToast } from "@/components/ui";

interface ImageUploaderProps {
  value: Img[];
  onChange: (images: Img[]) => void;
  folder: string;
  max?: number;
  className?: string;
}

/** Drag-and-drop / click uploader that sends files to Cloudinary through the API. */
export function ImageUploader({ value, onChange, folder, max = 8, className }: ImageUploaderProps) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const { toast } = useToast();

  async function handle(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, max - value.length);
    if (!list.length) return;
    setBusy(true);
    try {
      const uploaded = await uploadImages(list, folder);
      onChange([...value, ...uploaded]);
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setBusy(false);
    }
  }

  function makeCover(i: number) {
    const next = [...value];
    const [img] = next.splice(i, 1);
    onChange([img, ...next]);
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-3 gap-3">
        {value.map((img, i) => (
          <div key={img.url} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            {i === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">Cover</span>}
            <button type="button" onClick={() => onChange(value.filter((_, x) => x !== i))} aria-label="Remove image" className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100">
              <X size={12} weight="bold" />
            </button>
            {i !== 0 && (
              <button type="button" onClick={() => makeCover(i)} aria-label="Make cover" title="Make cover" className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100">
                <Star size={12} weight="fill" />
              </button>
            )}
          </div>
        ))}
        {value.length < max && (
          <button
            type="button"
            onClick={() => input.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
            disabled={busy}
            className={cn(
              "flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-xs text-muted transition-colors hover:border-indigo-600 hover:text-foreground",
              drag && "border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10",
            )}
          >
            <CloudArrowUp size={24} weight="regular" />
            {busy ? "Uploading…" : "Add photos"}
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files) handle(e.target.files); e.target.value = ""; }} />
    </div>
  );
}
