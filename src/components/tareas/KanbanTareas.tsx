"use client";

import { useTransition } from "react";
import { format } from "date-fns";
import type { EstadoTarea } from "@prisma/client";
import { ESTADOS_TAREA } from "@/lib/contenido";
import { formatMinutos } from "@/lib/dates";
import { actualizarEstadoTarea } from "@/lib/actions/tareas";
import type { TareaConRelaciones } from "./TareasClient";

export function KanbanTareas({
  tareas,
  onSeleccionar,
}: {
  tareas: TareaConRelaciones[];
  onSeleccionar: (t: TareaConRelaciones) => void;
}) {
  const [, startTransition] = useTransition();

  function onDrop(e: React.DragEvent, estado: EstadoTarea) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    startTransition(() => {
      actualizarEstadoTarea(id, estado);
    });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {ESTADOS_TAREA.map((columna) => (
        <div
          key={columna.value}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, columna.value as EstadoTarea)}
          className="rounded-xl border border-border bg-surface p-2"
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <h3 className="text-xs font-semibold text-muted">{columna.label}</h3>
            <span className="text-xs text-muted">
              {tareas.filter((t) => t.estado === columna.value).length}
            </span>
          </div>
          <div className="space-y-2">
            {tareas
              .filter((t) => t.estado === columna.value)
              .map((t) => {
                const minutos = t.registrosHoras.reduce((acc, r) => acc + r.minutos, 0);
                return (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", t.id)}
                    onClick={() => onSeleccionar(t)}
                    className="cursor-pointer rounded-lg border border-border bg-surface-muted p-2 text-xs hover:border-accent/50"
                  >
                    <div className="font-medium">{t.titulo}</div>
                    {t.piezaContenido && (
                      <div className="mt-1 truncate text-accent">↳ {t.piezaContenido.titulo}</div>
                    )}
                    <div className="mt-1 flex items-center justify-between text-muted">
                      <span>{t.asignadoA?.nombre ?? "Sin asignar"}</span>
                      {minutos > 0 && <span>{formatMinutos(minutos)}</span>}
                    </div>
                    {t.fechaLimite && (
                      <div className="mt-0.5 text-muted">vence {format(t.fechaLimite, "d MMM")}</div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
