import { prisma } from "@/lib/prisma";
import { currentWeekRange } from "@/lib/dates";

export async function getDashboardData() {
  const { inicio, fin } = currentWeekRange();

  const [piezasSemana, tareasAbiertas, registrosSemana] = await Promise.all([
    prisma.piezaContenido.findMany({
      where: { fechaPublicacion: { gte: inicio, lte: fin } },
      include: { asignadoA: true },
      orderBy: { fechaPublicacion: "asc" },
    }),
    prisma.tarea.findMany({
      where: { estado: { not: "hecho" } },
      include: { asignadoA: true, piezaContenido: true },
      orderBy: [{ fechaLimite: "asc" }],
      take: 8,
    }),
    prisma.registroHoras.findMany({
      where: { fecha: { gte: inicio, lte: fin } },
      include: { usuario: true },
    }),
  ]);

  const minutosPorPersona = new Map<string, { nombre: string; minutos: number }>();
  let minutosTotales = 0;
  for (const registro of registrosSemana) {
    minutosTotales += registro.minutos;
    const actual = minutosPorPersona.get(registro.usuarioId);
    if (actual) {
      actual.minutos += registro.minutos;
    } else {
      minutosPorPersona.set(registro.usuarioId, {
        nombre: registro.usuario.nombre,
        minutos: registro.minutos,
      });
    }
  }

  const publicadasSemana = piezasSemana.filter((p) => p.estado === "publicado");

  return {
    rangoSemana: { inicio, fin },
    piezasSemana,
    tareasAbiertas,
    minutosTotales,
    minutosPorPersona: Array.from(minutosPorPersona.values()).sort((a, b) => b.minutos - a.minutos),
    publicadasSemana,
  };
}
