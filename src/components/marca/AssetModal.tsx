"use client";

import { useState } from "react";
import type { AssetMarca, SeccionMarca } from "@prisma/client";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Field";
import { guardarAsset } from "@/lib/actions/marca";

const NOMBRES_SECCION: Record<SeccionMarca, string> = {
  colores: "Color",
  tipografia: "Tipografía",
  tono: "Tono de voz",
  logo: "Logo",
  correcto_incorrecto: "Ejemplo correcto/incorrecto",
  archivos: "Archivo",
  referencias: "Referencia",
};

export function AssetModal({
  open,
  onClose,
  asset,
  seccion,
  onEliminar,
}: {
  open: boolean;
  onClose: () => void;
  asset: AssetMarca | null;
  seccion: SeccionMarca;
  onEliminar?: () => void;
}) {
  const [enviando, setEnviando] = useState(false);
  const admiteArchivo = ["logo", "correcto_incorrecto", "archivos"].includes(seccion);
  const esColor = seccion === "colores";
  const esReferencia = seccion === "referencias";

  async function onSubmit(formData: FormData) {
    setEnviando(true);
    await guardarAsset(formData);
    setEnviando(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={asset ? "Editar elemento" : `Nuevo: ${NOMBRES_SECCION[seccion]}`}>
      <form action={onSubmit} className="space-y-3" encType="multipart/form-data">
        {asset && <input type="hidden" name="id" value={asset.id} />}
        <input type="hidden" name="seccion" value={seccion} />

        <div>
          <Label>Título</Label>
          <Input name="titulo" required defaultValue={asset?.titulo} />
        </div>

        <div>
          <Label>Descripción {esColor && "/ uso"}</Label>
          <Textarea name="descripcion" rows={2} defaultValue={asset?.descripcion ?? ""} />
        </div>

        {(esColor || esReferencia) && (
          <div>
            <Label>{esColor ? "Hex" : "URL"}</Label>
            <div className="flex gap-2">
              <Input
                name="valor"
                defaultValue={asset?.valor ?? (esColor ? "#6366f1" : "")}
                placeholder={esColor ? "#6366f1" : "https://…"}
              />
              {esColor && (
                <input
                  type="color"
                  defaultValue={asset?.valor ?? "#6366f1"}
                  className="h-10 w-12 rounded-lg border border-border bg-transparent"
                  onChange={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement | null;
                    if (input) input.value = e.target.value;
                  }}
                />
              )}
            </div>
          </div>
        )}

        {admiteArchivo && (
          <div>
            <Label>Archivo {asset?.rutaArchivo ? "(deja vacío para conservar el actual)" : ""}</Label>
            <Input type="file" name="archivo" accept="image/*,.pdf,.ai,.zip" />
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div>
            {onEliminar && (
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
