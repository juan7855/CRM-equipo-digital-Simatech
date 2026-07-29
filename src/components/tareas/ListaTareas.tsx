"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/Badge";
import { ESTADOS_PIPELINE } from "@/lib/contenido";
import { formatMinutos } from "@/lib/dates";
import type { TareaConRelaciones } from "./TareasClient";

export function ListaTareas({
  tareas,
  onSeleccionar,
}: {
  tareas: TareaConRelaciones[];
  onSeleccionar: (t: TareaConRelaciones) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted">
            <th className="px-4 py-3 font-medium">Tarea</th>
            <th className="px-4 py-3 font-medium">Asignado</th>
            <th className="px-4 py-3 font-medium">Vence</th>
            <th className="px-4 py-3 font-medium">Prioridad</th>
            <th className="px-4 py-3 font-medium">Horas</th>
            <th className="px-4 py-3 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map((t) => {
            const minutos = t.registrosHoras.reduce((acc, r) => acc + r.minutos, 0);
            return (
              <tr
                key={t.id}
                onClick={() => onSeleccionar(t)}
                className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-muted"
              >
                <td className="px-4 py-2.5">
                  <div className="font-medium">{t.titulo}</div>
                  {t.piezaContenido && (
                    <div className="text-xs text-accent">↳ {t.piezaContenido.titulo}</div>
                  )}
                </td>
                <td className="px-4 py-2.5 text-muted">{t.asignadoA?.nombre ?? "—"}</td>
                <td className="px-4 py-2.5 text-muted">
                  {t.fechaLimite ? format(t.fechaLimite, "d MMM yyyy") : "—"}
                </td>
                <td className="px-4 py-2.5 capitalize text-muted">{t.prioridad}</td>
                <td className="px-4 py-2.5 text-muted">{minutos > 0 ? formatMinutos(minutos) : "—"}</td>
                <td className="px-4 py-2.5">
                  <Badge
                    label={ESTADOS_PIPELINE.find((e) => e.value === t.estado)?.label ?? t.estado}
                    color="#34d399"
                  />
                </td>
              </tr>
            );
          })}
          {tareas.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted">
                No hay tareas que coincidan con el filtro.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
