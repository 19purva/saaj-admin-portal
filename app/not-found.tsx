import Link from "next/link";
import { SidebarSimple, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { GoBackButton } from "@/components/ui/GoBackButton";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      {/* Logo */}
      <Link href="/dashboard/overview" className="mb-12 flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{
            background: "linear-gradient(180deg, #A8394A 0%, #722F37 50%, #5A1520 100%)",
            boxShadow:
              "inset 0 1px 1px 0 rgba(255,255,255,0.35), inset 0 -1px 1px 0 rgba(0,0,0,0.10)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="8" height="8" rx="2" fill="white" />
            <rect x="13" y="3" width="8" height="8" rx="2" fill="white" opacity="0.6" />
            <rect x="3" y="13" width="8" height="8" rx="2" fill="white" opacity="0.6" />
            <rect x="13" y="13" width="8" height="8" rx="2" fill="white" />
          </svg>
        </div>
        <span
          className="font-heading text-lg font-semibold tracking-tight text-foreground"
          style={{ fontFeatureSettings: '"ss01"' }}
        >
          Saaj Admin
        </span>
      </Link>

      {/* 404 */}
      <div className="mb-6 font-heading text-[120px] font-semibold leading-none tracking-tight text-foreground opacity-[0.06] select-none">
        404
      </div>

      {/* Icon */}
      <div className="mb-6 -mt-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
        <MagnifyingGlass size={28} weight="regular" className="text-muted" />
      </div>

      {/* Copy */}
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Head back to the dashboard to continue.
      </p>

      {/* Actions */}
      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/dashboard/overview"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <SidebarSimple size={16} weight="regular" />
          Go to Dashboard
        </Link>
        <GoBackButton />
      </div>
    </div>
  );
}
