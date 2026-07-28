"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Rol } from "@prisma/client";

export async function agregarTaxonomia(formData: FormData) {
  await requireAdmin();
  const tipo = String(formData.get("tipo") ?? "");
  const etiqueta = String(formData.get("etiqueta") ?? "").trim();
  const color = String(formData.get("color") ?? "#6366f1");
  if (!tipo || !etiqueta) return;

  const count = await prisma.taxonomia.count({ where: { tipo } });
  await prisma.taxonomia.create({ data: { tipo, etiqueta, color, orden: count } });

  revalidatePath("/ajustes");
  revalidatePath("/calendario");
}

export async function eliminarTaxonomia(id: string) {
  await requireAdmin();
  await prisma.taxonomia.delete({ where: { id } });
  revalidatePath("/ajustes");
  revalidatePath("/calendario");
}

export async function crearUsuario(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const rol = String(formData.get("rol") ?? "miembro") as Rol;

  if (!email || !password || !nombre) return "Completa todos los campos.";
  if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";

  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    return error?.message ?? "No se pudo crear la cuenta.";
  }

  await prisma.usuario.create({
    data: { authId: data.user.id, email, nombre, rol },
  });

  revalidatePath("/ajustes/usuarios");
}

export async function cambiarRolUsuario(id: string, rol: Rol) {
  await requireAdmin();
  await prisma.usuario.update({ where: { id }, data: { rol } });
  revalidatePath("/ajustes/usuarios");
}
