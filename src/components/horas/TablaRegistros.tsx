"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/Button";
import { formatMinutos } from "@/lib/dates";
import { eliminarRegistroHoras } from "@/lib/actions/horas";
import type { RegistroHoras, Usuario, PiezaContenido, Tarea } from "@prisma/client";

type RegistroConRelaciones = RegistroHoras & {
  usuario: Usuario;
  piezaContenido: PiezaContenido | null;
  tarea: Tarea | null;
};

export function TablaRegistros({ registros }: { registros: RegistroConRelaciones[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted">
            <th className="px-4 py-3 font-medium">Fecha</th>
            <th className="px-4 py-3 font-medium">Persona</th>
            <th className="px-4 py-3 font-medium">Pieza / Tarea</th>
            <th className="px-4 py-3 font-medium">Descripción</th>
            <th className="px-4 py-3 font-medium">Tiempo</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {registros.slice(0, 30).map((r) => (
            <tr key={r.id} className="border-b border-border last:border-0">
              <td className="px-4 py-2.5 text-muted">{format(r.fecha, "d MMM yyyy")}</td>
              <td className="px-4 py-2.5">{r.usuario.nombre}</td>
              <td className="px-4 py-2.5">{r.piezaContenido?.titulo ?? r.tarea?.titulo ?? "—"}</td>
              <td className="px-4 py-2.5 text-muted">{r.descripcion ?? "—"}</td>
              <td className="px-4 py-2.5">{formatMinutos(r.minutos)}</td>
              <td className="px-4 py-2.5 text-right">
                <Button variant="ghost" onClick={() => eliminarRegistroHoras(r.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
          {registros.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted">
                Todavía no hay horas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
