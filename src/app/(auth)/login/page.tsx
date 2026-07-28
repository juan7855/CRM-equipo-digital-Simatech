"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6">
        <h1 className="mb-1 text-lg font-semibold">Equipo Digital Hub</h1>
        <p className="mb-6 text-sm text-muted">
          Herramienta interna de marketing y diseño. Entra con tu cuenta del equipo.
        </p>
        <form action={formAction} className="space-y-4">
          <div>
            <Label>Correo</Label>
            <Input type="email" name="email" required autoFocus placeholder="tu@equipo.com" />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input type="password" name="password" required placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" variant="primary" className="w-full" disabled={pending}>
            {pending ? "Entrando…" : "Entrar"}
          </Button>
        </form>
        <p className="mt-5 text-xs text-muted">
          ¿No tienes cuenta? Pídele a un admin del equipo que te la cree desde Ajustes → Usuarios.
        </p>
      </div>
    </div>
  );
}
