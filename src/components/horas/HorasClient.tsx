import { Card } from "@/components/ui/Card";
import { formatMinutos } from "@/lib/dates";
import { Timer } from "./Timer";
import { FormularioManual } from "./FormularioManual";
import { TablaRegistros } from "./TablaRegistros";
import { ReporteBarra } from "./ReporteBarra";
import type { getHorasData } from "@/lib/horas";
import type { Sujeto } from "./SelectorSujeto";

export function HorasClient({
  piezas,
  tareas,
  datos,
}: {
  piezas: Sujeto[];
  tareas: Sujeto[];
  datos: Awaited<ReturnType<typeof getHorasData>>;
}) {
  const totalMinutos = datos.registros.reduce((acc, r) => acc + r.minutos, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Registro de horas</h1>
        <p className="text-sm text-muted">
          Cuánto tiempo se invierte en cada tarea y pieza de contenido. Últimos 90 días:{" "}
          <span className="text-foreground">{formatMinutos(totalMinutos)}</span>
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold">Timer</h2>
          <Timer piezas={piezas} tareas={tareas} />
        </Card>
        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold">Carga manual</h2>
          <FormularioManual piezas={piezas} tareas={tareas} />
        </Card>
        <Card className="space-y-4 p-4">
          <h2 className="text-sm font-semibold">Reportes (90 días)</h2>
          <ReporteBarra titulo="Por persona" datos={datos.porPersona} />
          <ReporteBarra titulo="Por tipo de contenido" datos={datos.porTipoContenido} />
          <ReporteBarra titulo="Por canal" datos={datos.porCanal} />
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="mb-3 text-sm font-semibold">Registros recientes</h2>
        <TablaRegistros registros={datos.registros} />
      </Card>
    </div>
  );
}
