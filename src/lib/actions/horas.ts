"use server";

import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { TipoSujetoHoras } from "@prisma/client";

export async function registrarHoras(formData: FormData) {
  const usuario = await requireUsuario();

  const tipoSujeto = String(formData.get("tipoSujeto") ?? "") as TipoSujetoHoras;
  const sujetoId = String(formData.get("sujetoId") ?? "");
  const descripcion = String(formData.get("descripcion") ?? "") || null;
  const fecha = new Date(String(formData.get("fecha") ?? new Date().toISOString()));
  const minutos = Number(formData.get("minutos") ?? 0);
  const inicio = formData.get("inicio") ? new Date(String(formData.get("inicio"))) : null;
  const fin = formData.get("fin") ? new Date(String(formData.get("fin"))) : null;

  if (!sujetoId || minutos <= 0) return;

  await prisma.registroHoras.create({
    data: {
      tipoSujeto,
      descripcion,
      fecha,
      minutos: Math.round(minutos),
      inicio,
      fin,
      usuarioId: usuario.id,
      piezaContenidoId: tipoSujeto === "contenido" ? sujetoId : null,
      tareaId: tipoSujeto === "tarea" ? sujetoId : null,
    },
  });

  revalidatePath("/horas");
  revalidatePath("/tareas");
  revalidatePath("/");
}

export async function eliminarRegistroHoras(id: string) {
  await requireUsuario();
  await prisma.registroHoras.delete({ where: { id } });
  revalidatePath("/horas");
  revalidatePath("/tareas");
  revalidatePath("/");
}
