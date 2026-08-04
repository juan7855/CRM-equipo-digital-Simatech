-- CreateEnum
CREATE TYPE "EstadoObjetivo" AS ENUM ('activo', 'pausado', 'logrado');

-- AlterTable
ALTER TABLE "tareas" ADD COLUMN     "objetivoId" TEXT;

-- CreateTable
CREATE TABLE "objetivos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "porQue" TEXT NOT NULL,
    "estado" "EstadoObjetivo" NOT NULL DEFAULT 'activo',
    "fechaObjetivo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "objetivos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tareas" ADD CONSTRAINT "tareas_objetivoId_fkey" FOREIGN KEY ("objetivoId") REFERENCES "objetivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
