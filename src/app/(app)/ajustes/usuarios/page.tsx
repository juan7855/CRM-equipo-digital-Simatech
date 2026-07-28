import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { UsuariosClient } from "@/components/ajustes/UsuariosClient";

export default async function UsuariosPage() {
  const usuarioActual = await requireAdmin();
  const usuarios = await prisma.usuario.findMany({ orderBy: { createdAt: "asc" } });

  return <UsuariosClient usuarios={usuarios} usuarioActualId={usuarioActual.id} />;
}
