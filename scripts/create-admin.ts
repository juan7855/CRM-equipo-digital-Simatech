/**
 * Bootstrap: crea la primera cuenta admin (Supabase Auth + fila en Usuario).
 * Uso: npx tsx scripts/create-admin.ts correo@ejemplo.com "contraseña" "Nombre Apellido"
 * Requiere las variables de entorno de Supabase en .env (incluida SUPABASE_SERVICE_ROLE_KEY).
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const [email, password, nombre] = process.argv.slice(2);

if (!email || !password || !nombre) {
  console.error(
    'Uso: npx tsx scripts/create-admin.ts correo@ejemplo.com "contraseña" "Nombre Apellido"'
  );
  process.exit(1);
}

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const prisma = new PrismaClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    console.error("Error creando el usuario en Supabase Auth:", error?.message);
    process.exit(1);
  }

  await prisma.usuario.create({
    data: { authId: data.user.id, email, nombre, rol: "admin" },
  });

  console.log(`Cuenta admin creada: ${email}`);
  await prisma.$disconnect();
}

main();
