/*
  Warnings:

  - The `estado` column on the `piezas_contenido` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `estado` column on the `tareas` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EstadoPipeline" AS ENUM ('idea', 'redaccion', 'diseno', 'aprobacion', 'programado');

-- CreateEnum
CREATE TYPE "Publico" AS ENUM ('buyer_persona', 'audience_persona');

-- AlterTable
ALTER TABLE "piezas_contenido" ADD COLUMN     "publico" "Publico",
ALTER COLUMN "fechaPublicacion" DROP NOT NULL,
ALTER COLUMN "tipoContenido" DROP NOT NULL,
ALTER COLUMN "objetivo" DROP NOT NULL,
ALTER COLUMN "canal" DROP NOT NULL,
DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoPipeline" NOT NULL DEFAULT 'idea';

-- AlterTable
ALTER TABLE "tareas" DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoPipeline" NOT NULL DEFAULT 'idea';

-- DropEnum
DROP TYPE "EstadoContenido";

-- DropEnum
DROP TYPE "EstadoTarea";
