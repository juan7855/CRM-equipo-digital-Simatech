import { prisma } from "@/lib/prisma";
import { currentWeekRange } from "@/lib/dates";

export async function getDashboardData() {
  const { inicio, fin } = currentWeekRange();

  const [piezasSemana, tareasAbiertas, registrosSemana, bancoIdeas] = await Promise.all([
    prisma.piezaContenido.findMany({
      where: { fechaPublicacion: { gte: inicio, lte: fin } },
      include: { asignadoA: true },
      orderBy: { fechaPublicacion: "asc" },
    }),
    prisma.tarea.findMany({
      where: { estado: { not: "programado" } },
      include: { asignadoA: true, piezaContenido: true },
      orderBy: [{ fechaLimite: "asc" }],
      take: 8,
    }),
    prisma.registroHoras.findMany({
      where: { fecha: { gte: inicio, lte: fin } },
      include: { usuario: true },
    }),
    prisma.piezaContenido.findMany({
      where: { fechaPublicacion: null },
      orderBy: { createdAt: "desc" },
      take: 20,
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

  const programadasSemana = piezasSemana.filter((p) => p.estado === "programado");

  const buyerCount = piezasSemana.filter((p) => p.publico === "buyer_persona").length;
  const audienceCount = piezasSemana.filter((p) => p.publico === "audience_persona").length;

  return {
    rangoSemana: { inicio, fin },
    piezasSemana,
    tareasAbiertas,
    minutosTotales,
    minutosPorPersona: Array.from(minutosPorPersona.values()).sort((a, b) => b.minutos - a.minutos),
    programadasSemana,
    publico: { buyerCount, audienceCount },
    bancoIdeas,
  };
}
