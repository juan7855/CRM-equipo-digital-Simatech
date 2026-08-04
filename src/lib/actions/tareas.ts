"use server";

import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { EstadoPipeline, Prioridad } from "@prisma/client";

function leerCamposTarea(formData: FormData) {
  const asignadoAId = String(formData.get("asignadoAId") ?? "");
  const piezaContenidoId = String(formData.get("piezaContenidoId") ?? "");
  const objetivoId = String(formData.get("objetivoId") ?? "");
  const fechaLimite = String(formData.get("fechaLimite") ?? "");
  return {
    titulo: String(formData.get("titulo") ?? ""),
    descripcion: String(formData.get("descripcion") ?? "") || null,
    estado: String(formData.get("estado") ?? "idea") as EstadoPipeline,
    prioridad: String(formData.get("prioridad") ?? "media") as Prioridad,
    fechaLimite: fechaLimite ? new Date(fechaLimite) : null,
    asignadoAId: asignadoAId || null,
    piezaContenidoId: piezaContenidoId || null,
    objetivoId: objetivoId || null,
  };
}

export async function guardarTarea(formData: FormData) {
  await requireUsuario();
  const id = String(formData.get("id") ?? "");
  const data = leerCamposTarea(formData);

  if (id) {
    await prisma.tarea.update({ where: { id }, data });
  } else {
    await prisma.tarea.create({ data });
  }

  revalidatePath("/tareas");
  revalidatePath("/objetivos");
  revalidatePath("/");
}

export async function actualizarEstadoTarea(id: string, estado: EstadoPipeline) {
  await requireUsuario();
  await prisma.tarea.update({ where: { id }, data: { estado } });
  revalidatePath("/tareas");
  revalidatePath("/objetivos");
  revalidatePath("/");
}

export async function eliminarTarea(id: string) {
  await requireUsuario();
  await prisma.tarea.delete({ where: { id } });
  revalidatePath("/tareas");
  revalidatePath("/objetivos");
  revalidatePath("/");
}
