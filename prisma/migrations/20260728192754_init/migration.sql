-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('admin', 'miembro');

-- CreateEnum
CREATE TYPE "EstadoContenido" AS ENUM ('idea', 'borrador', 'pendiente_aprobacion', 'aprobado', 'programado', 'publicado');

-- CreateEnum
CREATE TYPE "EstadoTarea" AS ENUM ('por_hacer', 'haciendo', 'hecho');

-- CreateEnum
CREATE TYPE "Prioridad" AS ENUM ('baja', 'media', 'alta');

-- CreateEnum
CREATE TYPE "TipoSujetoHoras" AS ENUM ('contenido', 'tarea');

-- CreateEnum
CREATE TYPE "SeccionMarca" AS ENUM ('colores', 'tipografia', 'tono', 'logo', 'correcto_incorrecto', 'archivos', 'referencias');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'miembro',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxonomias" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "etiqueta" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6366f1',
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "taxonomias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "piezas_contenido" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "fechaPublicacion" TIMESTAMP(3) NOT NULL,
    "tipoContenido" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "canal" TEXT NOT NULL,
    "formato" TEXT,
    "dimensiones" TEXT,
    "copy" TEXT,
    "estado" "EstadoContenido" NOT NULL DEFAULT 'idea',
    "notas" TEXT,
    "asignadoAId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "piezas_contenido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tareas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" "EstadoTarea" NOT NULL DEFAULT 'por_hacer',
    "fechaLimite" TIMESTAMP(3),
    "prioridad" "Prioridad" NOT NULL DEFAULT 'media',
    "piezaContenidoId" TEXT,
    "asignadoAId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tareas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros_horas" (
    "id" TEXT NOT NULL,
    "tipoSujeto" "TipoSujetoHoras" NOT NULL,
    "descripcion" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "minutos" INTEGER NOT NULL,
    "inicio" TIMESTAMP(3),
    "fin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,
    "piezaContenidoId" TEXT,
    "tareaId" TEXT,

    CONSTRAINT "registros_horas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets_marca" (
    "id" TEXT NOT NULL,
    "seccion" "SeccionMarca" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "valor" TEXT,
    "rutaArchivo" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assets_marca_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_authId_key" ON "usuarios"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "taxonomias_tipo_etiqueta_key" ON "taxonomias"("tipo", "etiqueta");

-- AddForeignKey
ALTER TABLE "piezas_contenido" ADD CONSTRAINT "piezas_contenido_asignadoAId_fkey" FOREIGN KEY ("asignadoAId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tareas" ADD CONSTRAINT "tareas_piezaContenidoId_fkey" FOREIGN KEY ("piezaContenidoId") REFERENCES "piezas_contenido"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tareas" ADD CONSTRAINT "tareas_asignadoAId_fkey" FOREIGN KEY ("asignadoAId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_horas" ADD CONSTRAINT "registros_horas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_horas" ADD CONSTRAINT "registros_horas_piezaContenidoId_fkey" FOREIGN KEY ("piezaContenidoId") REFERENCES "piezas_contenido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_horas" ADD CONSTRAINT "registros_horas_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "tareas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
