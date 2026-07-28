"use client";

import { useMemo, useState } from "react";
import type { Tarea, Usuario, PiezaContenido, RegistroHoras } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { KanbanTareas } from "./KanbanTareas";
import { ListaTareas } from "./ListaTareas";
import { TareaModal } from "./TareaModal";

export type TareaConRelaciones = Tarea & {
  asignadoA: Usuario | null;
  piezaContenido: Pick<PiezaContenido, "id" | "titulo"> | null;
  registrosHoras: RegistroHoras[];
};

export function TareasClient({
  tareas,
  usuarios,
  piezas,
}: {
  tareas: TareaConRelaciones[];
  usuarios: Usuario[];
  piezas: { id: string; titulo: string }[];
}) {
  const [vista, setVista] = useState<"kanban" | "lista">("kanban");
  const [filtroPersona, setFiltroPersona] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<TareaConRelaciones | null>(null);

  const tareasFiltradas = useMemo(
    () => tareas.filter((t) => !filtroPersona || t.asignadoAId === filtroPersona),
    [tareas, filtroPersona]
  );

  function abrirNueva() {
    setTareaEditando(null);
    setModalAbierto(true);
  }

  function abrirEdicion(t: TareaConRelaciones) {
    setTareaEditando(t);
    setModalAbierto(true);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Tareas del equipo</h1>
          <p className="text-sm text-muted">
            Pendientes sueltos: investigar, buscar referencias, revisar tendencias…
          </p>
        </div>
        <Button variant="primary" onClick={abrirNueva}>
          + Nueva tarea
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-border bg-surface p-1 text-sm">
          {(["kanban", "lista"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setVista(v)}
              className={`rounded-md px-3 py-1.5 capitalize transition-colors ${
                vista === v ? "bg-accent text-accent-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <Select value={filtroPersona} onChange={(e) => setFiltroPersona(e.target.value)} className="w-auto">
          <option value="">Todo el equipo</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nombre}
            </option>
          ))}
        </Select>
      </div>

      {vista === "kanban" ? (
        <KanbanTareas tareas={tareasFiltradas} onSeleccionar={abrirEdicion} />
      ) : (
        <ListaTareas tareas={tareasFiltradas} onSeleccionar={abrirEdicion} />
      )}

      <TareaModal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        tarea={tareaEditando}
        usuarios={usuarios}
        piezas={piezas}
      />
    </div>
  );
}
