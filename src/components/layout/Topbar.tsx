import { logout } from "@/app/(app)/actions";
import { Button } from "@/components/ui/Button";

export function Topbar({ nombre, rol }: { nombre: string; rol: string }) {
  return (
    <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 sm:px-6">
      <form action="/buscar" method="GET" className="flex-1">
        <input
          type="search"
          name="q"
          placeholder="Buscar en contenido, tareas y marca…"
          className="w-full max-w-md rounded-lg border border-border bg-surface-muted px-3.5 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </form>
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <div className="text-sm font-medium">{nombre}</div>
          <div className="text-xs capitalize text-muted">{rol}</div>
        </div>
        <form action={logout}>
          <Button variant="ghost" type="submit" title="Cerrar sesión">
            Salir
          </Button>
        </form>
      </div>
    </header>
  );
}
