"use client";

import { useState } from "react";
import type { AssetMarca, SeccionMarca } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { eliminarAsset } from "@/lib/actions/marca";
import { AssetModal } from "./AssetModal";

const SECCIONES: { value: SeccionMarca; label: string }[] = [
  { value: "colores", label: "Colores" },
  { value: "tipografia", label: "Tipografía" },
  { value: "tono", label: "Tono de voz" },
  { value: "logo", label: "Logo" },
  { value: "correcto_incorrecto", label: "Correcto / incorrecto" },
  { value: "archivos", label: "Archivos" },
  { value: "referencias", label: "Referencias" },
];

export function MarcaClient({ assets, esAdmin }: { assets: AssetMarca[]; esAdmin: boolean }) {
  const [tab, setTab] = useState<SeccionMarca>("colores");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<AssetMarca | null>(null);

  const assetsTab = assets.filter((a) => a.seccion === tab);

  function abrirNuevo() {
    setEditando(null);
    setModalAbierto(true);
  }

  function abrirEdicion(a: AssetMarca) {
    setEditando(a);
    setModalAbierto(true);
  }

  async function onEliminar(id: string) {
    if (!confirm("¿Eliminar este elemento de la biblioteca de marca?")) return;
    await eliminarAsset(id);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Biblioteca de identidad visual</h1>
          <p className="text-sm text-muted">Colores, tipografía, tono, logo y referencias de marca.</p>
        </div>
        {esAdmin && (
          <Button variant="primary" onClick={abrirNuevo}>
            + Agregar a &quot;{SECCIONES.find((s) => s.value === tab)?.label}&quot;
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface p-1 text-sm">
        {SECCIONES.map((s) => (
          <button
            key={s.value}
            onClick={() => setTab(s.value)}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              tab === s.value ? "bg-accent text-accent-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {assetsTab.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted">
          Todavía no hay nada en esta sección.
          {esAdmin && " Usa el botón de arriba para agregar el primero."}
        </Card>
      ) : tab === "colores" ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {assetsTab.map((a) => (
            <Card
              key={a.id}
              className="cursor-pointer overflow-hidden"
              onClick={() => esAdmin && abrirEdicion(a)}
            >
              <div className="h-16" style={{ backgroundColor: a.valor ?? "#333" }} />
              <div className="p-2.5">
                <div className="text-sm font-medium">{a.titulo}</div>
                <div className="text-xs text-muted">{a.valor}</div>
              </div>
            </Card>
          ))}
        </div>
      ) : tab === "logo" || tab === "correcto_incorrecto" || tab === "archivos" ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {assetsTab.map((a) => (
            <Card key={a.id} className="overflow-hidden">
              {a.rutaArchivo && (a.rutaArchivo.match(/\.(png|jpe?g|webp|svg|gif)$/i) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.rutaArchivo} alt={a.titulo} className="h-32 w-full object-contain bg-surface-muted" />
              ) : (
                <a
                  href={a.rutaArchivo}
                  target="_blank"
                  className="flex h-32 items-center justify-center bg-surface-muted text-xs text-accent"
                >
                  Descargar archivo
                </a>
              ))}
              <div className="flex items-start justify-between gap-2 p-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{a.titulo}</div>
                  {a.descripcion && <div className="truncate text-xs text-muted">{a.descripcion}</div>}
                </div>
                {esAdmin && (
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" onClick={() => abrirEdicion(a)}>
                      Editar
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {assetsTab.map((a) => (
            <Card key={a.id} className="flex items-start justify-between gap-3 p-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">{a.titulo}</div>
                {a.descripcion && <p className="mt-0.5 text-sm text-muted">{a.descripcion}</p>}
                {a.valor && tab === "referencias" && (
                  <a href={a.valor} target="_blank" className="mt-0.5 block text-xs text-accent hover:underline">
                    {a.valor}
                  </a>
                )}
              </div>
              {esAdmin && (
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" onClick={() => abrirEdicion(a)}>
                    Editar
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {esAdmin && (
        <AssetModal
          open={modalAbierto}
          onClose={() => setModalAbierto(false)}
          asset={editando}
          seccion={tab}
          onEliminar={editando ? () => onEliminar(editando.id) : undefined}
        />
      )}
    </div>
  );
}
