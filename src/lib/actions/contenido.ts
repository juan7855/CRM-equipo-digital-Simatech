"use server";

import { prisma } from "@/lib/prisma";
import { requireUsuario } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { EstadoPipeline, Publico } from "@prisma/client";

function leerCamposPieza(formData: FormData) {
  const asignadoAId = String(formData.get("asignadoAId") ?? "");
  const fechaRaw = String(formData.get("fechaPublicacion") ?? "");
  const publico = String(formData.get("publico") ?? "");

  return {
    titulo: String(formData.get("titulo") ?? ""),
    fechaPublicacion: fechaRaw ? new Date(fechaRaw) : null,
    tipoContenido: String(formData.get("tipoContenido") ?? "") || null,
    objetivo: String(formData.get("objetivo") ?? "") || null,
    canal: String(formData.get("canal") ?? "") || null,
    publico: (publico || null) as Publico | null,
    formato: String(formData.get("formato") ?? "") || null,
    dimensiones: String(formData.get("dimensiones") ?? "") || null,
    copy: String(formData.get("copy") ?? "") || null,
    notas: String(formData.get("notas") ?? "") || null,
    estado: String(formData.get("estado") ?? "idea") as EstadoPipeline,
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

export async function actualizarEstadoPieza(id: string, estado: EstadoPipeline) {
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
      publico: original.publico,
      formato: original.formato,
      dimensiones: original.dimensiones,
      estado: "idea",
    },
  });
  revalidatePath("/calendario");
}

// Banco de ideas: alta rápida con solo el título, sin fecha de publicación.
export async function crearIdeaRapida(formData: FormData) {
  await requireUsuario();
  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!titulo) return;

  await prisma.piezaContenido.create({ data: { titulo } });
  revalidatePath("/");
  revalidatePath("/calendario");
}

// Asigna fecha de publicación a una idea del banco, lo que la hace aparecer
// en el calendario principal.
export async function asignarFechaPieza(id: string, fecha: string) {
  await requireUsuario();
  if (!fecha) return;
  await prisma.piezaContenido.update({ where: { id }, data: { fechaPublicacion: new Date(fecha) } });
  revalidatePath("/");
  revalidatePath("/calendario");
}
