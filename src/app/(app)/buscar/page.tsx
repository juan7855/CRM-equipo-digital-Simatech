import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";

  const [piezas, tareas, assets] = q
    ? await Promise.all([
        prisma.piezaContenido.findMany({
          where: {
            OR: [
              { titulo: { contains: q, mode: "insensitive" } },
              { copy: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 15,
        }),
        prisma.tarea.findMany({
          where: {
            OR: [
              { titulo: { contains: q, mode: "insensitive" } },
              { descripcion: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 15,
        }),
        prisma.assetMarca.findMany({
          where: {
            OR: [
              { titulo: { contains: q, mode: "insensitive" } },
              { descripcion: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 15,
        }),
      ])
    : [[], [], []];

  const sinResultados = q && piezas.length === 0 && tareas.length === 0 && assets.length === 0;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-xl font-semibold">Resultados para &quot;{q}&quot;</h1>

      {!q && <p className="text-sm text-muted">Escribe algo en el buscador de arriba.</p>}
      {sinResultados && <p className="text-sm text-muted">No se encontró nada relacionado con esa búsqueda.</p>}

      {piezas.length > 0 && (
        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold">Calendario de contenidos</h2>
          <ul className="space-y-2">
            {piezas.map((p) => (
              <li key={p.id}>
                <Link href="/calendario" className="flex items-center justify-between text-sm hover:text-accent">
                  <span>{p.titulo}</span>
                  <span className="text-xs text-muted">{format(p.fechaPublicacion, "d MMM yyyy")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {tareas.length > 0 && (
        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold">Tareas</h2>
          <ul className="space-y-2">
            {tareas.map((t) => (
              <li key={t.id}>
                <Link href="/tareas" className="flex items-center justify-between text-sm hover:text-accent">
                  <span>{t.titulo}</span>
                  <Badge label={t.estado.replace("_", " ")} color="#34d399" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {assets.length > 0 && (
        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold">Biblioteca de marca</h2>
          <ul className="space-y-2">
            {assets.map((a) => (
              <li key={a.id}>
                <Link href="/marca" className="flex items-center justify-between text-sm hover:text-accent">
                  <span>{a.titulo}</span>
                  <span className="text-xs capitalize text-muted">{a.seccion.replace("_", "/")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
