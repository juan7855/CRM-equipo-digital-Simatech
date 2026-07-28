import { differenceInHours } from "date-fns";

type PiezaSalud = {
  copy: string | null;
  dimensiones: string | null;
  objetivo: string | null;
  fechaPublicacion: Date;
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
  if (pieza.estado === "publicado") return false;
  const horasParaPublicar = differenceInHours(pieza.fechaPublicacion, new Date());
  if (horasParaPublicar > 48 || horasParaPublicar < 0) return false;
  return camposFaltantes(pieza).length > 0;
}

export const ESTADOS_CONTENIDO: { value: string; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "borrador", label: "Borrador" },
  { value: "pendiente_aprobacion", label: "Pendiente aprobación" },
  { value: "aprobado", label: "Aprobado" },
  { value: "programado", label: "Programado" },
  { value: "publicado", label: "Publicado" },
];

export const ESTADOS_TAREA: { value: string; label: string }[] = [
  { value: "por_hacer", label: "Por hacer" },
  { value: "haciendo", label: "Haciendo" },
  { value: "hecho", label: "Hecho" },
];

export const PRIORIDADES: { value: string; label: string }[] = [
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
];
