import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getSessionUsuario() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return prisma.usuario.findUnique({ where: { authId: user.id } });
}

export async function requireUsuario() {
  const usuario = await getSessionUsuario();
  if (!usuario) redirect("/login");
  return usuario;
}

export async function requireAdmin() {
  const usuario = await requireUsuario();
  if (usuario.rol !== "admin") redirect("/");
  return usuario;
}
