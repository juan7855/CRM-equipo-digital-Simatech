import { prisma } from "@/lib/prisma";
import { getTaxonomiasAgrupadas } from "@/lib/taxonomias";
import { CalendarioClient } from "@/components/calendario/CalendarioClient";

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const vista = typeof params.vista === "string" ? params.vista : "mes";
  const mes = typeof params.mes === "string" ? params.mes : undefined;

  const [piezas, taxonomias, usuarios, marcaColores, marcaTono] = await Promise.all([
    prisma.piezaContenido.findMany({
      include: { asignadoA: true },
      orderBy: { fechaPublicacion: "asc" },
    }),
    getTaxonomiasAgrupadas(),
    prisma.usuario.findMany({ orderBy: { nombre: "asc" } }),
    prisma.assetMarca.findMany({ where: { seccion: "colores" }, orderBy: { orden: "asc" } }),
    prisma.assetMarca.findMany({ where: { seccion: "tono" }, orderBy: { orden: "asc" } }),
  ]);

  return (
    <CalendarioClient
      piezas={piezas}
      taxonomias={taxonomias}
      usuarios={usuarios}
      marcaColores={marcaColores}
      marcaTono={marcaTono}
      vistaInicial={vista}
      mesInicial={mes}
    />
  );
}
