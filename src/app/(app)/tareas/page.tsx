import { prisma } from "@/lib/prisma";
import { TareasClient } from "@/components/tareas/TareasClient";

export default async function TareasPage() {
  const [tareas, usuarios, piezas] = await Promise.all([
    prisma.tarea.findMany({
      include: { asignadoA: true, piezaContenido: true, registrosHoras: true },
      orderBy: [{ fechaLimite: "asc" }, { createdAt: "desc" }],
    }),
    prisma.usuario.findMany({ orderBy: { nombre: "asc" } }),
    prisma.piezaContenido.findMany({
      select: { id: true, titulo: true },
      orderBy: { fechaPublicacion: "desc" },
    }),
  ]);

  return <TareasClient tareas={tareas} usuarios={usuarios} piezas={piezas} />;
}
