interface VaultLogoProps {
  className?: string;
  variant?: "default" | "white" | "glass";
}

/** Brand mark — kept under the template's filename so existing imports keep working. */
export function VaultLogo({ className }: VaultLogoProps) {
  return (
    <div
      className={className}
      style={{
        background: "linear-gradient(180deg, #A8394A 0%, #722F37 50%, #5A1520 100%)",
        boxShadow: "inset 0 1px 1px 0 rgba(255,255,255,0.35), inset 0 -1px 1px 0 rgba(0,0,0,0.10)",
      }}
    >
      <span className="font-heading text-xl font-semibold leading-none text-white">S</span>
    </div>
  );
}
