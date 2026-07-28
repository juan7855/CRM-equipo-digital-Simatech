"use client";

import type { Taxonomia } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { agregarTaxonomia, eliminarTaxonomia } from "@/lib/actions/ajustes";

export function AjustesClient({
  grupos,
}: {
  grupos: { tipo: string; nombre: string; items: Taxonomia[] }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {grupos.map((grupo) => (
        <Card key={grupo.tipo} className="p-4">
          <h2 className="mb-3 text-sm font-semibold">{grupo.nombre}</h2>
          <div className="mb-3 flex flex-wrap gap-2">
            {grupo.items.map((item) => (
              <div key={item.id} className="group relative">
                <Badge label={item.etiqueta} color={item.color} />
                <button
                  onClick={() => eliminarTaxonomia(item.id)}
                  className="absolute -right-1.5 -top-1.5 hidden h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white group-hover:flex"
                  title="Eliminar"
                >
                  ✕
                </button>
              </div>
            ))}
            {grupo.items.length === 0 && <p className="text-xs text-muted">Sin valores todavía.</p>}
          </div>
          <form action={agregarTaxonomia} className="flex gap-1.5">
            <input type="hidden" name="tipo" value={grupo.tipo} />
            <Input name="etiqueta" placeholder="Nuevo valor…" required className="text-xs" />
            <input type="color" name="color" defaultValue="#6366f1" className="h-9 w-9 rounded-lg border border-border bg-transparent" />
            <Button type="submit" variant="secondary">
              +
            </Button>
          </form>
        </Card>
      ))}
    </div>
  );
}
