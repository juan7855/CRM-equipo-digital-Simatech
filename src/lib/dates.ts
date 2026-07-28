import { startOfWeek, endOfWeek } from "date-fns";

export function currentWeekRange(reference: Date = new Date()) {
  return {
    inicio: startOfWeek(reference, { weekStartsOn: 1 }),
    fin: endOfWeek(reference, { weekStartsOn: 1 }),
  };
}

export function formatMinutos(minutos: number) {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  if (horas === 0) return `${mins}m`;
  if (mins === 0) return `${horas}h`;
  return `${horas}h ${mins}m`;
}
