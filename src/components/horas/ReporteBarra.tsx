import { formatMinutos } from "@/lib/dates";

export function ReporteBarra({
  titulo,
  datos,
}: {
  titulo: string;
  datos: { etiqueta: string; minutos: number }[];
}) {
  const maximo = Math.max(1, ...datos.map((d) => d.minutos));

  return (
    <div>
      <div className="mb-2 text-xs font-medium text-muted">{titulo}</div>
      {datos.length === 0 ? (
        <p className="text-sm text-muted">Sin datos todavía.</p>
      ) : (
        <div className="space-y-1.5">
          {datos.slice(0, 6).map((d) => (
            <div key={d.etiqueta} className="flex items-center gap-2 text-xs">
              <span className="w-20 shrink-0 truncate">{d.etiqueta}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${(d.minutos / maximo) * 100}%` }}
                />
              </div>
              <span className="w-14 shrink-0 text-right text-muted">{formatMinutos(d.minutos)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
