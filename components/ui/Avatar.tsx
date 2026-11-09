"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg" | "xl" | "2xl";

interface AvatarProps {
  src?: string;
  name?: string;
  initials?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-10 w-10 text-sm",
  xl: "h-12 w-12 text-base",
  "2xl": "h-20 w-20 text-2xl",
};

const pixelSizes: Record<AvatarSize, number> = {
  sm: 32,
  md: 36,
  lg: 40,
  xl: 48,
  "2xl": 80,
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ src, name, initials, size = "md", className }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const showInitials = !src || imageError;

  if (showInitials) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border-[0.5px] border-border bg-surface font-medium text-muted",
          sizeClasses[size],
          className,
        )}
      >
        {initials ?? (name ? getInitials(name) : "?")}
      </div>
    );
  }

  const isBlob = src.startsWith("blob:");

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        sizeClasses[size],
        className,
      )}
    >
      {isBlob ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name ?? initials ?? ""}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <Image
          src={src}
          alt={name ?? initials ?? ""}
          width={pixelSizes[size]}
          height={pixelSizes[size]}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}
