import { prisma } from "@/lib/prisma";

export const TIPOS_TAXONOMIA = ["tipo_contenido", "objetivo", "canal"] as const;

export type TipoTaxonomia = (typeof TIPOS_TAXONOMIA)[number];

export async function getTaxonomiasAgrupadas() {
  const filas = await prisma.taxonomia.findMany({
    orderBy: [{ tipo: "asc" }, { orden: "asc" }],
  });

  const agrupadas: Record<string, { id: string; etiqueta: string; color: string }[]> = {};
  for (const tipo of TIPOS_TAXONOMIA) agrupadas[tipo] = [];
  for (const fila of filas) {
    if (!agrupadas[fila.tipo]) agrupadas[fila.tipo] = [];
    agrupadas[fila.tipo].push({ id: fila.id, etiqueta: fila.etiqueta, color: fila.color });
  }
  return agrupadas;
}
