"use client";

import { Select } from "@/components/ui/Field";

export type Sujeto = { id: string; titulo: string };

export function SelectorSujeto({
  tipoSujeto,
  sujetoId,
  onTipoChange,
  onSujetoChange,
  piezas,
  tareas,
}: {
  tipoSujeto: "contenido" | "tarea";
  sujetoId: string;
  onTipoChange: (t: "contenido" | "tarea") => void;
  onSujetoChange: (id: string) => void;
  piezas: Sujeto[];
  tareas: Sujeto[];
}) {
  const opciones = tipoSujeto === "contenido" ? piezas : tareas;

  return (
    <div className="grid grid-cols-2 gap-2">
      <Select value={tipoSujeto} onChange={(e) => onTipoChange(e.target.value as "contenido" | "tarea")}>
        <option value="contenido">Pieza de contenido</option>
        <option value="tarea">Tarea</option>
      </Select>
      <Select value={sujetoId} onChange={(e) => onSujetoChange(e.target.value)}>
        <option value="">Elegir…</option>
        {opciones.map((o) => (
          <option key={o.id} value={o.id}>
            {o.titulo}
          </option>
        ))}
      </Select>
    </div>
  );
}
