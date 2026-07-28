import { prisma } from "@/lib/prisma";
import { subDays, format } from "date-fns";

export async function getHorasData() {
  const desde = subDays(new Date(), 90);

  const registros = await prisma.registroHoras.findMany({
    where: { fecha: { gte: desde } },
    include: { usuario: true, piezaContenido: true, tarea: true },
    orderBy: { fecha: "desc" },
  });

  const porPersona = new Map<string, number>();
  const porTipoContenido = new Map<string, number>();
  const porCanal = new Map<string, number>();
  const porSemana = new Map<string, number>();

  for (const r of registros) {
    porPersona.set(r.usuario.nombre, (porPersona.get(r.usuario.nombre) ?? 0) + r.minutos);

    if (r.piezaContenido) {
      porTipoContenido.set(
        r.piezaContenido.tipoContenido,
        (porTipoContenido.get(r.piezaContenido.tipoContenido) ?? 0) + r.minutos
      );
      porCanal.set(r.piezaContenido.canal, (porCanal.get(r.piezaContenido.canal) ?? 0) + r.minutos);
    }

    const semana = format(r.fecha, "yyyy-'S'ww");
    porSemana.set(semana, (porSemana.get(semana) ?? 0) + r.minutos);
  }

  const aOrdenado = (mapa: Map<string, number>) =>
    Array.from(mapa.entries())
      .map(([etiqueta, minutos]) => ({ etiqueta, minutos }))
      .sort((a, b) => b.minutos - a.minutos);

  return {
    registros,
    porPersona: aOrdenado(porPersona),
    porTipoContenido: aOrdenado(porTipoContenido),
    porCanal: aOrdenado(porCanal),
    porSemana: Array.from(porSemana.entries())
      .map(([etiqueta, minutos]) => ({ etiqueta, minutos }))
      .sort((a, b) => (a.etiqueta > b.etiqueta ? 1 : -1))
      .slice(-8),
  };
}
