import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { TIPOS_TAXONOMIA } from "@/lib/taxonomias";
import { AjustesClient } from "@/components/ajustes/AjustesClient";

const NOMBRES_TIPO: Record<string, string> = {
  tipo_contenido: "Tipos de contenido",
  objetivo: "Objetivos",
  canal: "Canales",
};

export default async function AjustesPage() {
  await requireAdmin();
  const taxonomias = await prisma.taxonomia.findMany({ orderBy: [{ tipo: "asc" }, { orden: "asc" }] });

  const grupos = TIPOS_TAXONOMIA.map((tipo) => ({
    tipo,
    nombre: NOMBRES_TIPO[tipo] ?? tipo,
    items: taxonomias.filter((t) => t.tipo === tipo),
  }));

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Ajustes</h1>
          <p className="text-sm text-muted">
            Listas configurables del calendario de contenidos (tipos, objetivos, canales).
          </p>
        </div>
        <Link href="/ajustes/usuarios" className="text-sm text-accent hover:underline">
          Usuarios del equipo →
        </Link>
      </div>

      <AjustesClient grupos={grupos} />
    </div>
  );
}
