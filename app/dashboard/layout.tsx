"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import { HeaderProvider } from "@/components/layout/HeaderContext";
import { Sidebar, MobileSidebar, Header } from "@/components/layout";
import { token } from "@/lib/api";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!token.get()) router.replace("/login");
    else setReady(true);
  }, [router]);

  if (!ready) return <div className="flex h-screen items-center justify-center bg-surface text-sm text-muted">Loading…</div>;

  return (
    <SidebarProvider>
      <HeaderProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar />
          <MobileSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface px-4 py-6 lg:px-8">{children}</main>
          </div>
        </div>
      </HeaderProvider>
    </SidebarProvider>
  );
}
