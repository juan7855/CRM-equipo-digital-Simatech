# Equipo Digital Hub

Herramienta interna de organización para el equipo de marketing y diseño: calendario de contenidos, tareas del equipo, registro de horas y biblioteca de identidad visual. Uso exclusivamente interno, sin gestión de clientes externos.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Postgres de Supabase**, accedido con **Prisma 6**
- **Supabase Auth** (email/contraseña) para las cuentas del equipo (roles `admin` / `miembro`)
- **Supabase Storage** para los archivos de la biblioteca de marca
- Desplegable en **Vercel**

## 1. Crear el proyecto de Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com) (plan gratuito es suficiente para 2-5 personas).
2. En **Settings → Database → Connection string**, copia:
   - la cadena con el **pooler** (puerto `6543`, con `?pgbouncer=true`) → `DATABASE_URL`
   - la cadena de **conexión directa** (puerto `5432`) → `DIRECT_URL`
3. En **Settings → API**, copia `Project URL`, `anon public key` y `service_role key`.
4. En **Storage**, crea un bucket público llamado `marca-assets` (para los archivos de la biblioteca de marca).

## 2. Configurar variables de entorno

Copia `.env.example` a `.env` y completa los valores del paso anterior:

```bash
cp .env.example .env
```

## 3. Instalar dependencias y preparar la base de datos

```bash
npm install
npm run prisma:migrate   # crea las tablas en Supabase
npm run seed             # siembra tipos de contenido, objetivos y canales por defecto
```

## 4. Crear la primera cuenta admin

No hay registro abierto: el equipo es cerrado y las cuentas las crea un admin desde la propia app. Para la primera cuenta (bootstrap), usa el script:

```bash
npm run bootstrap:admin -- correo@ejemplo.com "contraseña" "Nombre Apellido"
```

Con esa cuenta puedes entrar y crear al resto del equipo desde **Ajustes → Usuarios**.

## 5. Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 6. Desplegar en Vercel

1. Sube el proyecto a un repositorio y conéctalo en [vercel.com/new](https://vercel.com/new).
2. Agrega las mismas variables de entorno del `.env` en **Project Settings → Environment Variables**.
3. Antes del primer deploy (o tras cambios al esquema), corre `npm run prisma:deploy` apuntando a la base de Supabase de producción.

### Nota sobre el plan gratuito de Supabase

El proyecto se pausa automáticamente tras 7 días sin actividad (se reactiva manualmente desde el dashboard de Supabase) y no incluye backups automáticos. Para un equipo que entra a diario esto no debería pasar, pero si el equipo se toma unas vacaciones largas, hay que reactivarlo a mano.

## Estructura de la app

- `/` — Dashboard: piezas de la semana, tareas abiertas, horas registradas, resumen semanal.
- `/calendario` — Calendario de contenidos (vista mes / lista / kanban por estado).
- `/tareas` — Tareas sueltas del equipo (kanban / lista), enlazables a una pieza de contenido.
- `/horas` — Timer y carga manual de horas, con reportes por persona / tipo de contenido / canal.
- `/marca` — Biblioteca de identidad visual (colores, tipografía, tono, logo, archivos, referencias).
- `/ajustes` y `/ajustes/usuarios` — Listas configurables y alta de cuentas del equipo (solo admin).

## Scripts útiles

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Build y arranque en producción |
| `npm run prisma:generate` | Regenera el cliente de Prisma tras cambiar `schema.prisma` |
| `npm run prisma:migrate` | Crea/aplica una migración en desarrollo |
| `npm run prisma:deploy` | Aplica migraciones pendientes (producción) |
| `npm run seed` | Siembra las listas configurables por defecto |
| `npm run bootstrap:admin -- <correo> <contraseña> <nombre>` | Crea la primera cuenta admin |
