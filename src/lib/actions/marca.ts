"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { SeccionMarca } from "@prisma/client";

const BUCKET = "marca-assets";

export async function guardarAsset(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const seccion = String(formData.get("seccion") ?? "") as SeccionMarca;
  const titulo = String(formData.get("titulo") ?? "");
  const descripcion = String(formData.get("descripcion") ?? "") || null;
  const valor = String(formData.get("valor") ?? "") || null;
  const archivo = formData.get("archivo");

  let rutaArchivo: string | undefined;
  if (archivo instanceof File && archivo.size > 0) {
    const supabase = createAdminClient();
    const nombreArchivo = `${seccion}/${Date.now()}-${archivo.name}`;
    const { error } = await supabase.storage.from(BUCKET).upload(nombreArchivo, archivo, {
      upsert: true,
      contentType: archivo.type || undefined,
    });
    if (!error) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(nombreArchivo);
      rutaArchivo = data.publicUrl;
    }
  }

  if (id) {
    await prisma.assetMarca.update({
      where: { id },
      data: { titulo, descripcion, valor, ...(rutaArchivo ? { rutaArchivo } : {}) },
    });
  } else {
    const count = await prisma.assetMarca.count({ where: { seccion } });
    await prisma.assetMarca.create({
      data: { seccion, titulo, descripcion, valor, rutaArchivo: rutaArchivo ?? null, orden: count },
    });
  }

  revalidatePath("/marca");
  revalidatePath("/calendario");
}

export async function eliminarAsset(id: string) {
  await requireAdmin();
  await prisma.assetMarca.delete({ where: { id } });
  revalidatePath("/marca");
  revalidatePath("/calendario");
}
