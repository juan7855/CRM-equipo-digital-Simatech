"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { registrarHoras } from "@/lib/actions/horas";
import { SelectorSujeto, type Sujeto } from "./SelectorSujeto";

export function FormularioManual({ piezas, tareas }: { piezas: Sujeto[]; tareas: Sujeto[] }) {
  const [tipoSujeto, setTipoSujeto] = useState<"contenido" | "tarea">("contenido");
  const [sujetoId, setSujetoId] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(formData: FormData) {
    const horas = Number(formData.get("horasInput") ?? 0);
    const minutosExtra = Number(formData.get("minutosInput") ?? 0);
    const minutos = horas * 60 + minutosExtra;
    if (!sujetoId || minutos <= 0) return;

    formData.set("tipoSujeto", tipoSujeto);
    formData.set("sujetoId", sujetoId);
    formData.set("minutos", String(minutos));

    setEnviando(true);
    await registrarHoras(formData);
    setEnviando(false);
    (document.getElementById("form-horas-manual") as HTMLFormElement | null)?.reset();
    setSujetoId("");
  }

  return (
    <form id="form-horas-manual" action={onSubmit} className="space-y-3">
      <SelectorSujeto
        tipoSujeto={tipoSujeto}
        sujetoId={sujetoId}
        onTipoChange={(t) => {
          setTipoSujeto(t);
          setSujetoId("");
        }}
        onSujetoChange={setSujetoId}
        piezas={piezas}
        tareas={tareas}
      />
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label>Fecha</Label>
          <Input type="date" name="fecha" defaultValue={format(new Date(), "yyyy-MM-dd")} />
        </div>
        <div>
          <Label>Horas</Label>
          <Input type="number" name="horasInput" min={0} defaultValue={0} />
        </div>
        <div>
          <Label>Minutos</Label>
          <Input type="number" name="minutosInput" min={0} max={59} defaultValue={0} />
        </div>
      </div>
      <div>
        <Label>Descripción</Label>
        <Input name="descripcion" placeholder="¿Qué hiciste?" />
      </div>
      <Button type="submit" variant="primary" className="w-full" disabled={enviando || !sujetoId}>
        {enviando ? "Guardando…" : "Registrar horas"}
      </Button>
    </form>
  );
}
