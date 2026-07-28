import { requireUsuario } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const usuario = await requireUsuario();

  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin={usuario.rol === "admin"} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar nombre={usuario.nombre} rol={usuario.rol} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
