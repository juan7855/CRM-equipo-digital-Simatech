"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { registrarHoras } from "@/lib/actions/horas";
import { SelectorSujeto, type Sujeto } from "./SelectorSujeto";

export function Timer({ piezas, tareas }: { piezas: Sujeto[]; tareas: Sujeto[] }) {
  const [tipoSujeto, setTipoSujeto] = useState<"contenido" | "tarea">("contenido");
  const [sujetoId, setSujetoId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [corriendo, setCorriendo] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const inicioRef = useRef<Date | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!corriendo) return;
    const intervalo = setInterval(() => {
      if (inicioRef.current) {
        setSegundos(Math.floor((Date.now() - inicioRef.current.getTime()) / 1000));
      }
    }, 1000);
    return () => clearInterval(intervalo);
  }, [corriendo]);

  function iniciar() {
    if (!sujetoId) return;
    inicioRef.current = new Date();
    setSegundos(0);
    setCorriendo(true);
  }

  function detener() {
    if (!inicioRef.current) return;
    const inicio = inicioRef.current;
    const fin = new Date();
    const minutos = Math.max(1, Math.round((fin.getTime() - inicio.getTime()) / 60000));

    const formData = new FormData();
    formData.set("tipoSujeto", tipoSujeto);
    formData.set("sujetoId", sujetoId);
    formData.set("descripcion", descripcion);
    formData.set("fecha", inicio.toISOString());
    formData.set("inicio", inicio.toISOString());
    formData.set("fin", fin.toISOString());
    formData.set("minutos", String(minutos));

    startTransition(() => {
      registrarHoras(formData);
    });

    setCorriendo(false);
    setSegundos(0);
    setDescripcion("");
    inicioRef.current = null;
  }

  const hh = String(Math.floor(segundos / 3600)).padStart(2, "0");
  const mm = String(Math.floor((segundos % 3600) / 60)).padStart(2, "0");
  const ss = String(segundos % 60).padStart(2, "0");

  return (
    <div className="space-y-3">
      <div className="text-center font-mono text-3xl font-semibold tabular-nums">
        {hh}:{mm}:{ss}
      </div>
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
      <Input
        placeholder="¿En qué estás trabajando? (opcional)"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        disabled={corriendo}
      />
      {corriendo ? (
        <Button variant="danger" className="w-full" onClick={detener}>
          Detener y guardar
        </Button>
      ) : (
        <Button variant="primary" className="w-full" onClick={iniciar} disabled={!sujetoId}>
          Iniciar
        </Button>
      )}
    </div>
  );
}
