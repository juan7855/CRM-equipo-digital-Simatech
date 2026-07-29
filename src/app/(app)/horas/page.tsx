import { prisma } from "@/lib/prisma";
import { getHorasData } from "@/lib/horas";
import { HorasClient } from "@/components/horas/HorasClient";

export default async function HorasPage() {
  const [piezas, tareas, datos] = await Promise.all([
    prisma.piezaContenido.findMany({
      select: { id: true, titulo: true },
      orderBy: { fechaPublicacion: "desc" },
      take: 100,
    }),
    prisma.tarea.findMany({
      select: { id: true, titulo: true },
      where: { estado: { not: "programado" } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    getHorasData(),
  ]);

  return <HorasClient piezas={piezas} tareas={tareas} datos={datos} />;
}
