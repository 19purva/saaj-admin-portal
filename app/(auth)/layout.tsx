import { VaultLogo } from "@/components/layout/VaultLogo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#fffaf0] via-[#f7ead2] to-[#f3d9cf] p-12 dark:from-[#1c1410] dark:via-[#2b201a] dark:to-[#1c1410] lg:flex">
        <div className="animate-orb-1 pointer-events-none absolute -left-24 -top-24 h-[480px] w-[480px] rounded-full bg-[#722f37]/20 blur-[96px]" />
        <div className="animate-orb-2 pointer-events-none absolute -bottom-32 -right-16 h-[400px] w-[400px] rounded-full bg-[#c8932b]/25 blur-[96px]" />
        <div className="relative z-10 flex items-center gap-3 text-foreground">
          <VaultLogo className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]" />
          <span className="font-heading text-2xl font-semibold">The House of Saaj</span>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="font-heading text-5xl font-semibold leading-tight text-foreground">
            Your studio,
            <br />
            beautifully managed.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Upload photos, update products, and fulfil orders — all from one calm place.
          </p>
        </div>
        <p className="relative z-10 text-sm text-muted">&copy; {new Date().getFullYear()} The House of Saaj</p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <VaultLogo className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]" />
            <span className="font-heading text-xl font-bold text-foreground">Saaj Admin</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
