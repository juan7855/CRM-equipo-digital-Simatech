"use client";

import { useMemo, useState } from "react";
import type { PiezaContenido, Usuario, AssetMarca } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { parseMesParam } from "@/lib/calendario";
import { MonthGrid } from "./MonthGrid";
import { ListaTable } from "./ListaTable";
import { KanbanContenido } from "./KanbanContenido";
import { PiezaModal } from "./PiezaModal";

export type Pieza = PiezaContenido & { asignadoA: Usuario | null };
export type Taxonomias = Record<string, { id: string; etiqueta: string; color: string }[]>;

export function CalendarioClient({
  piezas,
  taxonomias,
  usuarios,
  marcaColores,
  marcaTono,
  vistaInicial,
  mesInicial,
}: {
  piezas: Pieza[];
  taxonomias: Taxonomias;
  usuarios: Usuario[];
  marcaColores: AssetMarca[];
  marcaTono: AssetMarca[];
  vistaInicial: string;
  mesInicial?: string;
}) {
  const [vista, setVista] = useState<"mes" | "lista" | "kanban">(
    (vistaInicial as "mes" | "lista" | "kanban") ?? "mes"
  );
  const [mesActual, setMesActual] = useState(() => parseMesParam(mesInicial));
  const [modalAbierto, setModalAbierto] = useState(false);
  const [piezaEditando, setPiezaEditando] = useState<Pieza | null>(null);
  const [filtroCanal, setFiltroCanal] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");

  const piezasFiltradas = useMemo(() => {
    return piezas.filter((p) => {
      if (filtroCanal && p.canal !== filtroCanal) return false;
      if (filtroTipo && p.tipoContenido !== filtroTipo) return false;
      return true;
    });
  }, [piezas, filtroCanal, filtroTipo]);

  function abrirNueva() {
    setPiezaEditando(null);
    setModalAbierto(true);
  }

  function abrirEdicion(pieza: Pieza) {
    setPiezaEditando(pieza);
    setModalAbierto(true);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Calendario de contenidos</h1>
          <p className="text-sm text-muted">Planea, redacta y sigue cada pieza hasta publicarla.</p>
        </div>
        <Button variant="primary" onClick={abrirNueva}>
          + Nueva pieza
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-border bg-surface p-1 text-sm">
          {(["mes", "lista", "kanban"] as const).map((v) => (
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

        <Select value={filtroCanal} onChange={(e) => setFiltroCanal(e.target.value)} className="w-auto">
          <option value="">Todos los canales</option>
          {taxonomias.canal?.map((c) => (
            <option key={c.id} value={c.etiqueta}>
              {c.etiqueta}
            </option>
          ))}
        </Select>

        <Select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className="w-auto">
          <option value="">Todos los tipos</option>
          {taxonomias.tipo_contenido?.map((t) => (
            <option key={t.id} value={t.etiqueta}>
              {t.etiqueta}
            </option>
          ))}
        </Select>
      </div>

      {vista === "mes" && (
        <MonthGrid
          piezas={piezasFiltradas}
          mesActual={mesActual}
          onCambiarMes={setMesActual}
          onSeleccionarPieza={abrirEdicion}
        />
      )}
      {vista === "lista" && (
        <ListaTable piezas={piezasFiltradas} onSeleccionarPieza={abrirEdicion} />
      )}
      {vista === "kanban" && (
        <KanbanContenido piezas={piezasFiltradas} onSeleccionarPieza={abrirEdicion} />
      )}

      <PiezaModal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        pieza={piezaEditando}
        taxonomias={taxonomias}
        usuarios={usuarios}
        marcaColores={marcaColores}
        marcaTono={marcaTono}
      />
    </div>
  );
}
