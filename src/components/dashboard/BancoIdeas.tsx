"use client";

import { useState } from "react";
import { format } from "date-fns";
import type { PiezaContenido } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { crearIdeaRapida, asignarFechaPieza } from "@/lib/actions/contenido";

function FilaIdea({ idea }: { idea: PiezaContenido }) {
  const [fecha, setFecha] = useState(format(new Date(), "yyyy-MM-dd"));
  const [enviando, setEnviando] = useState(false);

  async function onProgramar() {
    setEnviando(true);
    await asignarFechaPieza(idea.id, fecha);
    setEnviando(false);
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-2.5 text-sm">
      <span className="min-w-0 flex-1 truncate font-medium">{idea.titulo}</span>
      <div className="flex shrink-0 items-center gap-1.5">
        <Input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-[9.5rem] py-1.5 text-xs"
        />
        <Button variant="secondary" onClick={onProgramar} disabled={enviando}>
          {enviando ? "…" : "Programar"}
        </Button>
      </div>
    </li>
  );
}

export function BancoIdeas({ ideas }: { ideas: PiezaContenido[] }) {
  const [titulo, setTitulo] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(formData: FormData) {
    if (!String(formData.get("titulo") ?? "").trim()) return;
    setEnviando(true);
    await crearIdeaRapida(formData);
    setEnviando(false);
    setTitulo("");
  }

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Ideas de contenido que todavía no tienen fecha de publicación. Asígnales una fecha para que pasen al
        calendario principal.
      </p>
      <form action={onSubmit} className="mb-3 flex gap-2">
        <Input
          name="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Nueva idea… (ej. Reel detrás de cámaras del equipo)"
          className="flex-1"
        />
        <Button type="submit" variant="primary" disabled={enviando}>
          {enviando ? "Agregando…" : "+ Agregar"}
        </Button>
      </form>
      {ideas.length === 0 ? (
        <p className="text-sm text-muted">El banco de ideas está vacío por ahora.</p>
      ) : (
        <ul className="space-y-2">
          {ideas.map((idea) => (
            <FilaIdea key={idea.id} idea={idea} />
          ))}
        </ul>
      )}
    </div>
  );
}
