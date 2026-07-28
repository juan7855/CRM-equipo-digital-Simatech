import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import { MarcaClient } from "@/components/marca/MarcaClient";

export default async function MarcaPage() {
  const usuario = await requireUsuario();
  const assets = await prisma.assetMarca.findMany({ orderBy: [{ seccion: "asc" }, { orden: "asc" }] });

  return <MarcaClient assets={assets} esAdmin={usuario.rol === "admin"} />;
}
