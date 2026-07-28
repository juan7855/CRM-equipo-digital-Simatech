"use client";

import { useActionState } from "react";
import { format } from "date-fns";
import type { Usuario, Rol } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Field";
import { crearUsuario, cambiarRolUsuario } from "@/lib/actions/ajustes";

export function UsuariosClient({
  usuarios,
  usuarioActualId,
}: {
  usuarios: Usuario[];
  usuarioActualId: string;
}) {
  const [error, formAction, pending] = useActionState(crearUsuario, undefined);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Usuarios del equipo</h1>
        <p className="text-sm text-muted">
          El equipo es cerrado: solo un admin puede crear cuentas nuevas.
        </p>
      </div>

      <Card className="p-4">
        <h2 className="mb-3 text-sm font-semibold">Crear cuenta</h2>
        <form action={formAction} className="grid gap-3 sm:grid-cols-4">
          <div>
            <Label>Nombre</Label>
            <Input name="nombre" required />
          </div>
          <div>
            <Label>Correo</Label>
            <Input type="email" name="email" required />
          </div>
          <div>
            <Label>Contraseña temporal</Label>
            <Input type="password" name="password" required minLength={8} />
          </div>
          <div>
            <Label>Rol</Label>
            <Select name="rol" defaultValue="miembro">
              <option value="miembro">Miembro</option>
              <option value="admin">Admin</option>
            </Select>
          </div>
          {error && <p className="sm:col-span-4 text-sm text-red-400">{error}</p>}
          <div className="sm:col-span-4">
            <Button type="submit" variant="primary" disabled={pending}>
              {pending ? "Creando…" : "Crear cuenta"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Correo</th>
              <th className="px-4 py-3 font-medium">Desde</th>
              <th className="px-4 py-3 font-medium">Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-2.5 font-medium">{u.nombre}</td>
                <td className="px-4 py-2.5 text-muted">{u.email}</td>
                <td className="px-4 py-2.5 text-muted">{format(u.createdAt, "d MMM yyyy")}</td>
                <td className="px-4 py-2.5">
                  <Select
                    defaultValue={u.rol}
                    disabled={u.id === usuarioActualId}
                    onChange={(e) => cambiarRolUsuario(u.id, e.target.value as Rol)}
                    className="w-auto"
                  >
                    <option value="miembro">Miembro</option>
                    <option value="admin">Admin</option>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
