import { prisma } from "@/lib/prisma";
import { TareasClient } from "@/components/tareas/TareasClient";

export default async function TareasPage() {
  const [tareas, usuarios, piezas, objetivos] = await Promise.all([
    prisma.tarea.findMany({
      include: { asignadoA: true, piezaContenido: true, registrosHoras: true, objetivo: true },
      orderBy: [{ fechaLimite: "asc" }, { createdAt: "desc" }],
    }),
    prisma.usuario.findMany({ orderBy: { nombre: "asc" } }),
    prisma.piezaContenido.findMany({
      select: { id: true, titulo: true },
      orderBy: { fechaPublicacion: "desc" },
    }),
    prisma.objetivo.findMany({
      select: { id: true, titulo: true },
      orderBy: { titulo: "asc" },
    }),
  ]);

  return <TareasClient tareas={tareas} usuarios={usuarios} piezas={piezas} objetivos={objetivos} />;
}
