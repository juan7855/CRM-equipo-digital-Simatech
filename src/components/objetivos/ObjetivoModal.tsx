"use client";

import { useState } from "react";
import { format } from "date-fns";
import type { Objetivo } from "@prisma/client";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { ESTADOS_OBJETIVO } from "@/lib/objetivos";
import { guardarObjetivo, eliminarObjetivo } from "@/lib/actions/objetivos";

export function ObjetivoModal({
  open,
  onClose,
  objetivo,
}: {
  open: boolean;
  onClose: () => void;
  objetivo: Objetivo | null;
}) {
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(formData: FormData) {
    setEnviando(true);
    await guardarObjetivo(formData);
    setEnviando(false);
    onClose();
  }

  async function onEliminar() {
    if (!objetivo) return;
    if (!confirm(`¿Eliminar el objetivo "${objetivo.titulo}"? Las tareas vinculadas quedarán sin objetivo.`)) return;
    await eliminarObjetivo(objetivo.id);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={objetivo ? "Editar objetivo" : "Nuevo objetivo"}>
      <form action={onSubmit} className="space-y-3">
        {objetivo && <input type="hidden" name="id" value={objetivo.id} />}

        <div>
          <Label>Título</Label>
          <Input name="titulo" required defaultValue={objetivo?.titulo} placeholder="Duplicar leads calificados en Q3" />
        </div>

        <div>
          <Label>Por qué</Label>
          <Textarea
            name="porQue"
            rows={3}
            required
            defaultValue={objetivo?.porQue ?? ""}
            placeholder="El motivo y el contexto detrás de este objetivo…"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Estado</Label>
            <Select name="estado" defaultValue={objetivo?.estado ?? "activo"}>
              {ESTADOS_OBJETIVO.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Fecha objetivo</Label>
            <Input
              type="date"
              name="fechaObjetivo"
              defaultValue={objetivo?.fechaObjetivo ? format(objetivo.fechaObjetivo, "yyyy-MM-dd") : ""}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            {objetivo && (
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
