"use server";

import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { EstadoObjetivo } from "@prisma/client";

export async function guardarObjetivo(formData: FormData) {
  await requireUsuario();
  const id = String(formData.get("id") ?? "");
  const fechaObjetivo = String(formData.get("fechaObjetivo") ?? "");

  const data = {
    titulo: String(formData.get("titulo") ?? ""),
    porQue: String(formData.get("porQue") ?? ""),
    estado: String(formData.get("estado") ?? "activo") as EstadoObjetivo,
    fechaObjetivo: fechaObjetivo ? new Date(fechaObjetivo) : null,
  };

  if (id) {
    await prisma.objetivo.update({ where: { id }, data });
  } else {
    await prisma.objetivo.create({ data });
  }

  revalidatePath("/objetivos");
  revalidatePath("/tareas");
}

export async function eliminarObjetivo(id: string) {
  await requireUsuario();
  await prisma.objetivo.delete({ where: { id } });
  revalidatePath("/objetivos");
  revalidatePath("/tareas");
}
