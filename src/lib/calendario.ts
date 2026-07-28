import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  eachWeekOfInterval,
} from "date-fns";

export function buildMonthGrid(mesRef: Date) {
  const inicioMes = startOfMonth(mesRef);
  const finMes = endOfMonth(mesRef);
  const semanas = eachWeekOfInterval(
    { start: startOfWeek(inicioMes, { weekStartsOn: 1 }), end: endOfWeek(finMes, { weekStartsOn: 1 }) },
    { weekStartsOn: 1 }
  );

  return semanas.map((inicioSemana) =>
    eachDayOfInterval({ start: inicioSemana, end: endOfWeek(inicioSemana, { weekStartsOn: 1 }) })
  );
}

export function parseMesParam(mes?: string) {
  if (!mes) return new Date();
  const [anio, mesNum] = mes.split("-").map(Number);
  if (!anio || !mesNum) return new Date();
  return new Date(anio, mesNum - 1, 1);
}
