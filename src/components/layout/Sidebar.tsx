"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "◧" },
  { href: "/calendario", label: "Calendario", icon: "▤" },
  { href: "/tareas", label: "Tareas", icon: "☑" },
  { href: "/horas", label: "Horas", icon: "◔" },
  { href: "/marca", label: "Marca", icon: "◆" },
];

function NavLink({ href, icon, label, active }: { href: string; icon: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-2.5 overflow-hidden rounded-lg px-2.5 py-2 text-sm transition-all duration-200 ${
        active
          ? "bg-accent/15 text-accent font-medium"
          : "text-muted hover:bg-surface-muted hover:text-foreground hover:pl-3.5"
      }`}
    >
      <span
        className={`absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-accent transition-all duration-200 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
      <span className={`w-4 text-center transition-transform duration-200 ${active ? "scale-110" : ""}`}>{icon}</span>
      {label}
    </Link>
  );
}

export function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-surface p-4 sm:flex">
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="animate-glow flex h-7 w-7 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground">
          E
        </span>
        <span className="text-sm font-semibold">Equipo Digital</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)}
          />
        ))}
        {isAdmin && (
          <>
            <div className="mt-3 mb-1 px-2.5 text-[11px] font-medium uppercase tracking-wide text-muted/70">
              Administración
            </div>
            <NavLink href="/ajustes" icon="⚙" label="Ajustes" active={pathname.startsWith("/ajustes")} />
          </>
        )}
      </nav>
    </aside>
  );
}
