"use client";

import { addMonths, format, isSameDay, isSameMonth, isToday, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { buildMonthGrid } from "@/lib/calendario";
import { piezaEnRiesgo } from "@/lib/contenido";
import { Button } from "@/components/ui/Button";
import type { Pieza } from "./CalendarioClient";

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function MonthGrid({
  piezas,
  mesActual,
  onCambiarMes,
  onSeleccionarPieza,
}: {
  piezas: Pieza[];
  mesActual: Date;
  onCambiarMes: (d: Date) => void;
  onSeleccionarPieza: (p: Pieza) => void;
}) {
  const semanas = buildMonthGrid(mesActual);

  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold capitalize">
          {format(mesActual, "MMMM yyyy", { locale: es })}
        </h2>
        <div className="flex gap-1">
          <Button variant="ghost" onClick={() => onCambiarMes(subMonths(mesActual, 1))}>
            ←
          </Button>
          <Button variant="ghost" onClick={() => onCambiarMes(new Date())}>
            Hoy
          </Button>
          <Button variant="ghost" onClick={() => onCambiarMes(addMonths(mesActual, 1))}>
            →
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border text-xs">
        {DIAS.map((d) => (
          <div key={d} className="bg-surface-muted px-2 py-1.5 text-center font-medium text-muted">
            {d}
          </div>
        ))}
        {semanas.flat().map((dia) => {
          const piezasDelDia = piezas.filter((p) => isSameDay(p.fechaPublicacion, dia));
          return (
            <div
              key={dia.toISOString()}
              className={`min-h-[92px] bg-surface p-1.5 ${
                !isSameMonth(dia, mesActual) ? "opacity-40" : ""
              }`}
            >
              <div
                className={`mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                  isToday(dia) ? "bg-accent text-accent-foreground" : "text-muted"
                }`}
              >
                {format(dia, "d")}
              </div>
              <div className="space-y-1">
                {piezasDelDia.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSeleccionarPieza(p)}
                    className="block w-full truncate rounded-md bg-accent/15 px-1.5 py-1 text-left text-[11px] text-accent hover:bg-accent/25"
                    title={p.titulo}
                  >
                    {piezaEnRiesgo(p) && "⚠ "}
                    {p.titulo}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
