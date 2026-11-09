"use client";

import { KeyboardEvent, useState } from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  label?: string;
  placeholder?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}

export function TagInput({
  label,
  placeholder = "Add tag and press Enter",
  tags,
  onChange,
  className,
}: TagInputProps) {
  const [input, setInput] = useState("");

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      const tag = input.trim();
      if (!tags.includes(tag)) {
        onChange([...tags, tag]);
      }
      setInput("");
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="flex min-h-10 w-full flex-wrap gap-1.5 rounded-lg border border-border bg-card px-3 py-2 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-600/10 px-2 py-0.5 text-xs font-medium text-indigo-600"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-indigo-600/60 hover:text-indigo-600"
            >
              <X size={12} weight="bold" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 bg-transparent text-sm text-foreground placeholder:text-neutral-400 focus:outline-none"
        />
      </div>
    </div>
  );
}
