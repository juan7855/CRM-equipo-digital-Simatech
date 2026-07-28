import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TAXONOMIAS: { tipo: string; etiqueta: string; color: string }[] = [
  { tipo: "tipo_contenido", etiqueta: "Post", color: "#6366f1" },
  { tipo: "tipo_contenido", etiqueta: "Reel", color: "#ec4899" },
  { tipo: "tipo_contenido", etiqueta: "Video", color: "#f59e0b" },
  { tipo: "tipo_contenido", etiqueta: "Blog", color: "#10b981" },
  { tipo: "tipo_contenido", etiqueta: "Newsletter", color: "#0ea5e9" },

  { tipo: "objetivo", etiqueta: "Awareness", color: "#6366f1" },
  { tipo: "objetivo", etiqueta: "Venta", color: "#ef4444" },
  { tipo: "objetivo", etiqueta: "Engagement", color: "#ec4899" },
  { tipo: "objetivo", etiqueta: "Educación", color: "#10b981" },

  { tipo: "canal", etiqueta: "Instagram", color: "#e1306c" },
  { tipo: "canal", etiqueta: "LinkedIn", color: "#0a66c2" },
  { tipo: "canal", etiqueta: "TikTok", color: "#111827" },
  { tipo: "canal", etiqueta: "Blog", color: "#10b981" },
  { tipo: "canal", etiqueta: "Email", color: "#0ea5e9" },
  { tipo: "canal", etiqueta: "YouTube", color: "#ff0000" },
];

async function main() {
  for (let i = 0; i < TAXONOMIAS.length; i++) {
    const t = TAXONOMIAS[i];
    await prisma.taxonomia.upsert({
      where: { tipo_etiqueta: { tipo: t.tipo, etiqueta: t.etiqueta } },
      update: {},
      create: { ...t, orden: i },
    });
  }
  console.log(`Sembradas ${TAXONOMIAS.length} taxonomías por defecto.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
