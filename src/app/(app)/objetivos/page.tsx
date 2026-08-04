import { prisma } from "@/lib/prisma";
import { ObjetivosClient } from "@/components/objetivos/ObjetivosClient";

export default async function ObjetivosPage() {
  const objetivos = await prisma.objetivo.findMany({
    include: { tareas: { orderBy: [{ fechaLimite: "asc" }, { createdAt: "desc" }] } },
    orderBy: [{ estado: "asc" }, { createdAt: "desc" }],
  });

  return <ObjetivosClient objetivos={objetivos} />;
}
