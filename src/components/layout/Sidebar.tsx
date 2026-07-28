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

export function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-surface p-4 sm:flex">
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground">
          E
        </span>
        <span className="text-sm font-semibold">Equipo Digital</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                active
                  ? "bg-accent/15 text-accent font-medium"
                  : "text-muted hover:bg-surface-muted hover:text-foreground"
              }`}
            >
              <span className="w-4 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        {isAdmin && (
          <>
            <div className="mt-3 mb-1 px-2.5 text-[11px] font-medium uppercase tracking-wide text-muted/70">
              Administración
            </div>
            <Link
              href="/ajustes"
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                pathname.startsWith("/ajustes")
                  ? "bg-accent/15 text-accent font-medium"
                  : "text-muted hover:bg-surface-muted hover:text-foreground"
              }`}
            >
              <span className="w-4 text-center">⚙</span>
              Ajustes
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
