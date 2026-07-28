"use client";

import { useTransition } from "react";
import { format } from "date-fns";
import type { EstadoContenido } from "@prisma/client";
import { ESTADOS_CONTENIDO, piezaEnRiesgo } from "@/lib/contenido";
import { actualizarEstadoPieza } from "@/lib/actions/contenido";
import type { Pieza } from "./CalendarioClient";

export function KanbanContenido({
  piezas,
  onSeleccionarPieza,
}: {
  piezas: Pieza[];
  onSeleccionarPieza: (p: Pieza) => void;
}) {
  const [, startTransition] = useTransition();

  function onDrop(e: React.DragEvent, estado: EstadoContenido) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    startTransition(() => {
      actualizarEstadoPieza(id, estado);
    });
  }

  return (
    <div className="grid gap-3 overflow-x-auto pb-2 sm:grid-cols-3 lg:grid-cols-6">
      {ESTADOS_CONTENIDO.map((columna) => (
        <div
          key={columna.value}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, columna.value as EstadoContenido)}
          className="min-w-[200px] rounded-xl border border-border bg-surface p-2"
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <h3 className="text-xs font-semibold text-muted">{columna.label}</h3>
            <span className="text-xs text-muted">
              {piezas.filter((p) => p.estado === columna.value).length}
            </span>
          </div>
          <div className="space-y-2">
            {piezas
              .filter((p) => p.estado === columna.value)
              .map((p) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", p.id)}
                  onClick={() => onSeleccionarPieza(p)}
                  className="cursor-pointer rounded-lg border border-border bg-surface-muted p-2 text-xs hover:border-accent/50"
                >
                  <div className="font-medium">
                    {piezaEnRiesgo(p) && (
                      <span className="animate-dot-pulse mr-1 inline-block text-amber-400">⚠</span>
                    )}
                    {p.titulo}
                  </div>
                  <div className="mt-1 text-muted">
                    {p.canal} · {format(p.fechaPublicacion, "d MMM")}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
