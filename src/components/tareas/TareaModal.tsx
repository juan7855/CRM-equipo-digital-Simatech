"use client";

import { useState } from "react";
import { format } from "date-fns";
import type { Usuario } from "@prisma/client";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { ESTADOS_PIPELINE, PRIORIDADES } from "@/lib/contenido";
import { formatMinutos } from "@/lib/dates";
import { guardarTarea, eliminarTarea } from "@/lib/actions/tareas";
import type { TareaConRelaciones } from "./TareasClient";

export function TareaModal({
  open,
  onClose,
  tarea,
  usuarios,
  piezas,
  objetivos,
}: {
  open: boolean;
  onClose: () => void;
  tarea: TareaConRelaciones | null;
  usuarios: Usuario[];
  piezas: { id: string; titulo: string }[];
  objetivos: { id: string; titulo: string }[];
}) {
  const [enviando, setEnviando] = useState(false);
  const minutos = tarea?.registrosHoras.reduce((acc, r) => acc + r.minutos, 0) ?? 0;

  async function onSubmit(formData: FormData) {
    setEnviando(true);
    await guardarTarea(formData);
    setEnviando(false);
    onClose();
  }

  async function onEliminar() {
    if (!tarea) return;
    if (!confirm(`¿Eliminar "${tarea.titulo}"?`)) return;
    await eliminarTarea(tarea.id);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={tarea ? "Editar tarea" : "Nueva tarea"}>
      <form action={onSubmit} className="space-y-3">
        {tarea && <input type="hidden" name="id" value={tarea.id} />}

        <div>
          <Label>Título</Label>
          <Input name="titulo" required defaultValue={tarea?.titulo} placeholder="Investigar tendencia de..." />
        </div>

        <div>
          <Label>Descripción</Label>
          <Textarea name="descripcion" rows={3} defaultValue={tarea?.descripcion ?? ""} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Estado</Label>
            <Select name="estado" defaultValue={tarea?.estado ?? "idea"}>
              {ESTADOS_PIPELINE.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Prioridad</Label>
            <Select name="prioridad" defaultValue={tarea?.prioridad ?? "media"}>
              {PRIORIDADES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Fecha límite</Label>
            <Input
              type="date"
              name="fechaLimite"
              defaultValue={tarea?.fechaLimite ? format(tarea.fechaLimite, "yyyy-MM-dd") : ""}
            />
          </div>
          <div>
            <Label>Asignado a</Label>
            <Select name="asignadoAId" defaultValue={tarea?.asignadoAId ?? ""}>
              <option value="">Sin asignar</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label>Pieza de contenido relacionada (opcional)</Label>
          <Select name="piezaContenidoId" defaultValue={tarea?.piezaContenidoId ?? ""}>
            <option value="">Ninguna</option>
            {piezas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.titulo}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Objetivo relacionado (opcional)</Label>
          <Select name="objetivoId" defaultValue={tarea?.objetivoId ?? ""}>
            <option value="">Ninguno</option>
            {objetivos.map((o) => (
              <option key={o.id} value={o.id}>
                {o.titulo}
              </option>
            ))}
          </Select>
        </div>

        {tarea && minutos > 0 && (
          <p className="text-xs text-muted">
            Horas registradas en esta tarea: <span className="text-foreground">{formatMinutos(minutos)}</span> (ver
            en /horas)
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div>
            {tarea && (
              <Button type="button" variant="danger" onClick={onEliminar}>
                Eliminar
              </Button>
            )}
          </div>
          <Button type="submit" variant="primary" disabled={enviando}>
            {enviando ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
