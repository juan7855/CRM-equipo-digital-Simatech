"use server";

import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { EstadoContenido } from "@prisma/client";

function leerCamposPieza(formData: FormData) {
  const asignadoAId = String(formData.get("asignadoAId") ?? "");
  return {
    titulo: String(formData.get("titulo") ?? ""),
    fechaPublicacion: new Date(String(formData.get("fechaPublicacion"))),
    tipoContenido: String(formData.get("tipoContenido") ?? ""),
    objetivo: String(formData.get("objetivo") ?? ""),
    canal: String(formData.get("canal") ?? ""),
    formato: String(formData.get("formato") ?? "") || null,
    dimensiones: String(formData.get("dimensiones") ?? "") || null,
    copy: String(formData.get("copy") ?? "") || null,
    notas: String(formData.get("notas") ?? "") || null,
    estado: String(formData.get("estado") ?? "idea") as EstadoContenido,
    asignadoAId: asignadoAId || null,
  };
}

export async function guardarPieza(formData: FormData) {
  await requireUsuario();
  const id = String(formData.get("id") ?? "");
  const data = leerCamposPieza(formData);

  if (id) {
    await prisma.piezaContenido.update({ where: { id }, data });
  } else {
    await prisma.piezaContenido.create({ data });
  }

  revalidatePath("/calendario");
  revalidatePath("/");
}

export async function actualizarEstadoPieza(id: string, estado: EstadoContenido) {
  await requireUsuario();
  await prisma.piezaContenido.update({ where: { id }, data: { estado } });
  revalidatePath("/calendario");
  revalidatePath("/");
}

export async function eliminarPieza(id: string) {
  await requireUsuario();
  await prisma.piezaContenido.delete({ where: { id } });
  revalidatePath("/calendario");
  revalidatePath("/");
}

export async function duplicarPieza(id: string) {
  await requireUsuario();
  const original = await prisma.piezaContenido.findUniqueOrThrow({ where: { id } });
  await prisma.piezaContenido.create({
    data: {
      titulo: `${original.titulo} (copia)`,
      fechaPublicacion: original.fechaPublicacion,
      tipoContenido: original.tipoContenido,
      objetivo: original.objetivo,
      canal: original.canal,
      formato: original.formato,
      dimensiones: original.dimensiones,
      estado: "idea",
    },
  });
  revalidatePath("/calendario");
}
