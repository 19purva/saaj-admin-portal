"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartPieSlice,
  Package,
  Images,
  Tag,
  ShoppingBag,
  EnvelopeSimple,
  InstagramLogo,
  GearSix,
  SignOut,
  X,
  ArrowLineLeft,
  ArrowLineRight,
  Storefront,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { token, STORE_URL } from "@/lib/api";
import { Modal, Button } from "@/components/ui";
import { useSidebar } from "./SidebarContext";
import { VaultLogo as VaultLogoBase } from "./VaultLogo";

function VaultLogo() {
  return <VaultLogoBase className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]" />;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const mainNav: NavItem[] = [
  { label: "Overview", href: "/dashboard/overview", icon: ChartPieSlice },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Categories", href: "/dashboard/categories", icon: Tag },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: Images },
  { label: "Instagram", href: "/dashboard/instagram", icon: InstagramLogo },
  { label: "Enquiries", href: "/dashboard/enquiries", icon: EnvelopeSimple },
];


// ── Shared nav link ──────────────────────────────────────────────────────────

function NavLink({
  item,
  collapsed = false,
  onClick,
  isActive,
}: {
  item: NavItem;
  collapsed?: boolean;
  onClick?: () => void;
  isActive: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center text-sm font-medium border",
        "transition-[background-color,color,border-color] duration-200 ease-in-out",
        collapsed ? "h-11 justify-center px-0" : "h-11 px-3",
        isActive
          ? "rounded-lg border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-400"
          : "rounded-lg border-transparent text-neutral-600 dark:text-neutral-300 hover:bg-surface hover:text-foreground",
      )}
    >
      <Icon
        size={20}
        weight={isActive ? "fill" : "regular"}
        className="shrink-0"
      />
      <span
        className={cn(
          "overflow-hidden whitespace-nowrap transition-all duration-300 ease-out",
          collapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[150px] opacity-100 ml-3",
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}

// ── Shared sidebar content ───────────────────────────────────────────────────

function SidebarContent({
  collapsed,
  onCollapse,
  onExpand,
  onNavClick,
  hideLogo = false,
  animated = false,
}: {
  collapsed: boolean;
  onCollapse: () => void;
  onExpand: () => void;
  onNavClick?: () => void;
  hideLogo?: boolean;
  animated?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);


  const isActive = (href: string) => {
    if (href === "/dashboard/overview") {
      return pathname === "/dashboard/overview" || pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Logo row */}
      {!hideLogo && <div
        className={cn(
          "flex items-center border-b border-border",
          collapsed ? "h-20 justify-center px-3" : "h-20 justify-between px-4",
        )}
      >
        {collapsed ? (
          <Link href="/dashboard/overview" onClick={onNavClick} title="Saaj Admin">
            <VaultLogo />
          </Link>
        ) : (
          <>
            <Link
              href="/dashboard/overview"
              onClick={onNavClick}
              className="flex items-center gap-3"
            >
              <VaultLogo />
              <span className="font-heading text-[20px] font-semibold text-foreground">
                Saaj Admin
              </span>
            </Link>
            <button
              onClick={onCollapse}
              title="Collapse sidebar"
              className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface"
            >
              <ArrowLineLeft size={20} weight="regular" />
            </button>
          </>
        )}
      </div>}

      {collapsed && (
        <div className="flex h-12 items-center border-b border-border px-3">
          <button
            onClick={onExpand}
            title="Expand sidebar"
            className="flex h-9 w-full items-center justify-center rounded-lg text-foreground transition-colors hover:bg-surface"
          >
            <ArrowLineRight size={20} weight="regular" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className={cn("flex-1 overflow-y-auto py-4", collapsed ? "px-2" : "px-3")}>
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-widest text-muted">
            Main Menu
          </p>
        )}
        <div className="space-y-0.5">
          {mainNav.map((item, i) => (
            animated ? (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.04, duration: 0.22, ease: "easeOut" }}
              >
                <NavLink
                  item={item}
                  collapsed={collapsed}
                  onClick={onNavClick}
                  isActive={isActive(item.href)}
                />
              </motion.div>
            ) : (
              <NavLink
                key={item.href}
                item={item}
                collapsed={collapsed}
                onClick={onNavClick}
                isActive={isActive(item.href)}
              />
            )
          ))}
        </div>

      </nav>

      {/* Bottom: Settings + Log out */}
      <div className={cn("border-t border-border py-3", collapsed ? "px-2" : "px-3")}>
        <div className="space-y-0.5">
          <a
            href={STORE_URL}
            target="_blank"
            rel="noreferrer"
            title="View store"
            className={cn("flex h-11 items-center rounded-lg border border-transparent text-sm font-medium text-neutral-600 transition-colors hover:bg-surface hover:text-foreground dark:text-neutral-300", collapsed ? "justify-center" : "px-3")}
          >
            <Storefront size={20} weight="regular" className="shrink-0" />
            {!collapsed && <span className="ml-3">View store</span>}
          </a>
          <NavLink
            item={{ label: "Settings", href: "/dashboard/settings", icon: GearSix }}
            collapsed={collapsed}
            onClick={onNavClick}
            isActive={isActive("/dashboard/settings")}
          />
          <button
            onClick={() => setLogoutOpen(true)}
            className={cn(
              "flex w-full items-center rounded-full border border-transparent text-sm font-medium text-neutral-600 dark:text-neutral-300 transition-colors hover:bg-surface hover:text-foreground",
              collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5 gap-3",
            )}
          >
            <SignOut size={20} weight="regular" className="shrink-0" />
            <span className={cn(
              "overflow-hidden whitespace-nowrap transition-all duration-300 ease-out",
              collapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[150px] opacity-100",
            )}>
              Log out
            </span>
          </button>
        </div>
      </div>

      <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Log out" size="sm">
        <div className="space-y-4 p-6">
          <p className="text-sm text-muted">
            Are you sure you want to log out? You'll need to sign in again to manage your store.
          </p>
        </div>
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={() => setLogoutOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => { token.clear(); router.push("/login"); }}>Log out</Button>
        </div>
      </Modal>
    </>
  );
}

// ── Desktop Sidebar ──────────────────────────────────────────────────────────

export function Sidebar({ className }: { className?: string }) {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-border bg-background",
        "transition-[width] duration-300 ease-in-out overflow-hidden",
        collapsed ? "w-[72px]" : "w-[240px]",
        className,
      )}
    >
      <SidebarContent
        collapsed={collapsed}
        onCollapse={() => setCollapsed(true)}
        onExpand={() => setCollapsed(false)}
      />
    </aside>
  );
}

// ── Mobile Sidebar ───────────────────────────────────────────────────────────

export function MobileSidebar() {
  const { mobileOpen, setMobileOpen } = useSidebar();
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-border bg-background lg:hidden"
          >

            {/* Mobile header with close */}
            <div className="flex h-20 items-center justify-between border-b border-border px-4">
              <Link
                href="/dashboard/overview"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                <VaultLogo />
                <span className="font-heading text-[20px] font-semibold text-foreground">
                  Vault
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-foreground"
              >
                <X size={20} weight="regular" />
              </button>
            </div>

            <SidebarContent
              collapsed={false}
              onCollapse={() => setMobileOpen(false)}
              onExpand={() => {}}
              onNavClick={() => setMobileOpen(false)}
              hideLogo
              animated
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
