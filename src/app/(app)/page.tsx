import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getDashboardData } from "@/lib/dashboard";
import { formatMinutos } from "@/lib/dates";
import { piezaEnRiesgo, ESTADOS_CONTENIDO } from "@/lib/contenido";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted">
          Semana del {format(data.rangoSemana.inicio, "d 'de' MMMM", { locale: es })} al{" "}
          {format(data.rangoSemana.fin, "d 'de' MMMM", { locale: es })}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="relative overflow-hidden p-4">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
          <div className="text-xs text-muted">Piezas esta semana</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">
            <AnimatedNumber value={data.piezasSemana.length} />
          </div>
        </Card>
        <Card className="relative overflow-hidden p-4">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
          <div className="text-xs text-muted">Tareas abiertas</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">
            <AnimatedNumber value={data.tareasAbiertas.length} />
          </div>
        </Card>
        <Card className="relative overflow-hidden p-4">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
          <div className="text-xs text-muted">Horas registradas esta semana</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">
            <AnimatedNumber value={data.minutosTotales} unidad="minutos" />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Piezas de la semana</h2>
            <Link href="/calendario" className="text-xs text-accent hover:underline">
              Ver calendario →
            </Link>
          </div>
          {data.piezasSemana.length === 0 && (
            <p className="text-sm text-muted">No hay piezas programadas esta semana.</p>
          )}
          <ul className="space-y-2">
            {data.piezasSemana.map((pieza) => (
              <li
                key={pieza.id}
                className="flex items-center justify-between rounded-lg border border-border p-2.5 text-sm"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{pieza.titulo}</div>
                  <div className="text-xs text-muted">
                    {format(pieza.fechaPublicacion, "EEE d MMM", { locale: es })} · {pieza.canal}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {piezaEnRiesgo(pieza) && <Badge label="Faltan datos" color="#f59e0b" />}
                  <Badge
                    label={ESTADOS_CONTENIDO.find((e) => e.value === pieza.estado)?.label ?? pieza.estado}
                    color="#818cf8"
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Tareas abiertas</h2>
            <Link href="/tareas" className="text-xs text-accent hover:underline">
              Ver tareas →
            </Link>
          </div>
          {data.tareasAbiertas.length === 0 && (
            <p className="text-sm text-muted">No hay tareas abiertas. 🎉</p>
          )}
          <ul className="space-y-2">
            {data.tareasAbiertas.map((tarea) => (
              <li
                key={tarea.id}
                className="flex items-center justify-between rounded-lg border border-border p-2.5 text-sm"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{tarea.titulo}</div>
                  <div className="text-xs text-muted">
                    {tarea.asignadoA?.nombre ?? "Sin asignar"}
                    {tarea.fechaLimite &&
                      ` · vence ${format(tarea.fechaLimite, "d MMM", { locale: es })}`}
                  </div>
                </div>
                <Badge label={tarea.estado.replace("_", " ")} color="#34d399" />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="mb-3 text-sm font-semibold">Resumen semanal</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-xs font-medium text-muted">Publicado esta semana</div>
            {data.publicadasSemana.length === 0 ? (
              <p className="text-sm text-muted">Nada publicado todavía.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {data.publicadasSemana.map((p) => (
                  <li key={p.id}>· {p.titulo}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <div className="mb-2 text-xs font-medium text-muted">Horas por persona</div>
            {data.minutosPorPersona.length === 0 ? (
              <p className="text-sm text-muted">Sin horas registradas.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {data.minutosPorPersona.map((p) => (
                  <li key={p.nombre} className="flex justify-between">
                    <span>{p.nombre}</span>
                    <span className="text-muted">{formatMinutos(p.minutos)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
