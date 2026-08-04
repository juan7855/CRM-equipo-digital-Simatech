"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Objetivo, Tarea } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ESTADOS_OBJETIVO } from "@/lib/objetivos";
import { ESTADOS_PIPELINE } from "@/lib/contenido";
import { ObjetivoModal } from "./ObjetivoModal";

export type ObjetivoConTareas = Objetivo & { tareas: Tarea[] };

export function ObjetivosClient({ objetivos }: { objetivos: ObjetivoConTareas[] }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Objetivo | null>(null);

  function abrirNuevo() {
    setEditando(null);
    setModalAbierto(true);
  }

  function abrirEdicion(o: Objetivo) {
    setEditando(o);
    setModalAbierto(true);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Objetivos del equipo</h1>
          <p className="text-sm text-muted">Qué estamos persiguiendo y qué tareas reales lo están moviendo.</p>
        </div>
        <Button variant="primary" onClick={abrirNuevo}>
          + Nuevo objetivo
        </Button>
      </div>

      {objetivos.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted">
          Todavía no hay objetivos. Usa el botón de arriba para crear el primero.
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {objetivos.map((o) => {
            const estado = ESTADOS_OBJETIVO.find((e) => e.value === o.estado);
            return (
              <Card key={o.id} className="cursor-pointer p-4" onClick={() => abrirEdicion(o)}>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm font-semibold">{o.titulo}</h2>
                  <Badge label={estado?.label ?? o.estado} color={estado?.color} />
                </div>
                <p className="mt-2 text-sm text-muted">{o.porQue}</p>
                {o.fechaObjetivo && (
                  <p className="mt-2 text-xs text-muted">
                    Meta: {format(o.fechaObjetivo, "d 'de' MMMM yyyy", { locale: es })}
                  </p>
                )}

                <div className="mt-3 border-t border-border pt-3">
                  <div className="mb-1.5 text-xs font-medium text-muted">
                    Tareas vinculadas {o.tareas.length > 0 && `(${o.tareas.length})`}
                  </div>
                  {o.tareas.length === 0 ? (
                    <p className="text-xs text-muted">Ninguna todavía.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {o.tareas.map((t) => (
                        <li key={t.id} className="flex items-center justify-between gap-2 text-sm">
                          <span className="truncate">{t.titulo}</span>
                          <Badge
                            label={ESTADOS_PIPELINE.find((e) => e.value === t.estado)?.label ?? t.estado}
                            color="#818cf8"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ObjetivoModal open={modalAbierto} onClose={() => setModalAbierto(false)} objetivo={editando} />
    </div>
  );
}
