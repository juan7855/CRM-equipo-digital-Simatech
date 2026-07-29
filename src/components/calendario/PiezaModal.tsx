"use client";

import { useState } from "react";
import { format } from "date-fns";
import type { AssetMarca, Usuario } from "@prisma/client";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { ESTADOS_PIPELINE, PUBLICOS } from "@/lib/contenido";
import { guardarPieza, eliminarPieza, duplicarPieza } from "@/lib/actions/contenido";
import type { Pieza, Taxonomias } from "./CalendarioClient";

export function PiezaModal({
  open,
  onClose,
  pieza,
  taxonomias,
  usuarios,
  marcaColores,
  marcaTono,
}: {
  open: boolean;
  onClose: () => void;
  pieza: Pieza | null;
  taxonomias: Taxonomias;
  usuarios: Usuario[];
  marcaColores: AssetMarca[];
  marcaTono: AssetMarca[];
}) {
  const [copiado, setCopiado] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(formData: FormData) {
    setEnviando(true);
    await guardarPieza(formData);
    setEnviando(false);
    onClose();
  }

  async function onEliminar() {
    if (!pieza) return;
    if (!confirm(`¿Eliminar "${pieza.titulo}"? Esta acción no se puede deshacer.`)) return;
    await eliminarPieza(pieza.id);
    onClose();
  }

  async function onDuplicar() {
    if (!pieza) return;
    await duplicarPieza(pieza.id);
    onClose();
  }

  function copiarColor(hex: string) {
    navigator.clipboard?.writeText(hex);
    setCopiado(hex);
    setTimeout(() => setCopiado(null), 1200);
  }

  return (
    <Modal open={open} onClose={onClose} title={pieza ? "Editar pieza" : "Nueva pieza"}>
      <form action={onSubmit} className="space-y-3">
        {pieza && <input type="hidden" name="id" value={pieza.id} />}

        <div>
          <Label>Título</Label>
          <Input name="titulo" required defaultValue={pieza?.titulo} placeholder="Reel lanzamiento producto X" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Fecha de publicación (vacío = queda en el banco de ideas)</Label>
            <Input
              type="date"
              name="fechaPublicacion"
              defaultValue={pieza?.fechaPublicacion ? format(pieza.fechaPublicacion, "yyyy-MM-dd") : ""}
            />
          </div>
          <div>
            <Label>Estado</Label>
            <Select name="estado" defaultValue={pieza?.estado ?? "idea"}>
              {ESTADOS_PIPELINE.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Público objetivo</Label>
            <Select name="publico" defaultValue={pieza?.publico ?? ""}>
              <option value="">Sin definir</option>
              {PUBLICOS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Asignado a</Label>
            <Select name="asignadoAId" defaultValue={pieza?.asignadoAId ?? ""}>
              <option value="">Sin asignar</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Tipo de contenido</Label>
            <Select name="tipoContenido" defaultValue={pieza?.tipoContenido ?? ""}>
              <option value="">Sin definir</option>
              {taxonomias.tipo_contenido?.map((t) => (
                <option key={t.id} value={t.etiqueta}>
                  {t.etiqueta}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Objetivo</Label>
            <Select name="objetivo" defaultValue={pieza?.objetivo ?? ""}>
              <option value="">Sin definir</option>
              {taxonomias.objetivo?.map((o) => (
                <option key={o.id} value={o.etiqueta}>
                  {o.etiqueta}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Canal</Label>
            <Select name="canal" defaultValue={pieza?.canal ?? ""}>
              <option value="">Sin definir</option>
              {taxonomias.canal?.map((c) => (
                <option key={c.id} value={c.etiqueta}>
                  {c.etiqueta}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Formato</Label>
            <Input name="formato" defaultValue={pieza?.formato ?? ""} placeholder="Imagen única, carrusel, 9:16…" />
          </div>
          <div>
            <Label>Dimensiones</Label>
            <Input name="dimensiones" defaultValue={pieza?.dimensiones ?? ""} placeholder="1080x1350" />
          </div>
        </div>

        <div>
          <Label>Copy</Label>
          <Textarea name="copy" rows={4} defaultValue={pieza?.copy ?? ""} placeholder="Texto de la pieza…" />
        </div>

        {(marcaColores.length > 0 || marcaTono.length > 0) && (
          <div className="rounded-lg border border-border bg-surface-muted p-3">
            <div className="mb-2 text-xs font-medium text-muted">Guía rápida de marca</div>
            {marcaColores.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {marcaColores.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => c.valor && copiarColor(c.valor)}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-2 py-1 text-[11px]"
                    title={`Copiar ${c.valor}`}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-border"
                      style={{ backgroundColor: c.valor ?? undefined }}
                    />
                    {copiado === c.valor ? "¡Copiado!" : c.titulo}
                  </button>
                ))}
              </div>
            )}
            {marcaTono.length > 0 && (
              <ul className="space-y-1 text-[11px] text-muted">
                {marcaTono.map((t) => (
                  <li key={t.id}>
                    <span className="font-medium text-foreground">{t.titulo}:</span> {t.descripcion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div>
          <Label>Notas</Label>
          <Textarea name="notas" rows={2} defaultValue={pieza?.notas ?? ""} />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            {pieza && (
              <>
                <Button type="button" variant="secondary" onClick={onDuplicar}>
                  Duplicar
                </Button>
                <Button type="button" variant="danger" onClick={onEliminar}>
                  Eliminar
                </Button>
              </>
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
