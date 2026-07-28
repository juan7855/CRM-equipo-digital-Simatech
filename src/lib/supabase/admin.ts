import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente con la Service Role Key: solo para usarse en Server Actions/route
// handlers que necesiten crear cuentas de usuario. Nunca importar desde
// código de cliente.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
