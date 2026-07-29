"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/Badge";
import { ESTADOS_PIPELINE, piezaEnRiesgo } from "@/lib/contenido";
import type { Pieza } from "./CalendarioClient";

export function ListaTable({
  piezas,
  onSeleccionarPieza,
}: {
  piezas: Pieza[];
  onSeleccionarPieza: (p: Pieza) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted">
            <th className="px-4 py-3 font-medium">Pieza</th>
            <th className="px-4 py-3 font-medium">Fecha</th>
            <th className="px-4 py-3 font-medium">Canal</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Objetivo</th>
            <th className="px-4 py-3 font-medium">Asignado</th>
            <th className="px-4 py-3 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody>
          {piezas.map((p) => (
            <tr
              key={p.id}
              onClick={() => onSeleccionarPieza(p)}
              className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-muted"
            >
              <td className="px-4 py-2.5 font-medium">
                {piezaEnRiesgo(p) && <span className="animate-dot-pulse mr-1 inline-block text-amber-400">⚠</span>}
                {p.titulo}
              </td>
              <td className="px-4 py-2.5 text-muted">
                {p.fechaPublicacion ? format(p.fechaPublicacion, "d MMM yyyy", { locale: es }) : "Sin fecha"}
              </td>
              <td className="px-4 py-2.5">{p.canal ?? "—"}</td>
              <td className="px-4 py-2.5">{p.tipoContenido ?? "—"}</td>
              <td className="px-4 py-2.5">{p.objetivo ?? "—"}</td>
              <td className="px-4 py-2.5 text-muted">{p.asignadoA?.nombre ?? "—"}</td>
              <td className="px-4 py-2.5">
                <Badge
                  label={ESTADOS_PIPELINE.find((e) => e.value === p.estado)?.label ?? p.estado}
                  color="#818cf8"
                />
              </td>
            </tr>
          ))}
          {piezas.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-muted">
                No hay piezas que coincidan con el filtro.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
