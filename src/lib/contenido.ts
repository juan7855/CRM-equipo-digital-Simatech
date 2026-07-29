import { differenceInHours } from "date-fns";

type PiezaSalud = {
  copy: string | null;
  dimensiones: string | null;
  objetivo: string | null;
  fechaPublicacion: Date | null;
  estado: string;
};

export function camposFaltantes(pieza: PiezaSalud) {
  const faltantes: string[] = [];
  if (!pieza.copy) faltantes.push("copy");
  if (!pieza.dimensiones) faltantes.push("dimensiones");
  if (!pieza.objetivo) faltantes.push("objetivo");
  return faltantes;
}

export function piezaEnRiesgo(pieza: PiezaSalud) {
  if (pieza.estado === "programado") return false;
  if (!pieza.fechaPublicacion) return false;
  const horasParaPublicar = differenceInHours(pieza.fechaPublicacion, new Date());
  if (horasParaPublicar > 48 || horasParaPublicar < 0) return false;
  return camposFaltantes(pieza).length > 0;
}

// Pipeline de producción compartido por Piezas de contenido y Tareas.
export const ESTADOS_PIPELINE: { value: string; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "redaccion", label: "Redacción" },
  { value: "diseno", label: "Diseño" },
  { value: "aprobacion", label: "Aprobación" },
  { value: "programado", label: "Programado" },
];

export const PUBLICOS: { value: string; label: string }[] = [
  { value: "buyer_persona", label: "Buyer Persona" },
  { value: "audience_persona", label: "Audience Persona" },
];

export const PRIORIDADES: { value: string; label: string }[] = [
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
];
