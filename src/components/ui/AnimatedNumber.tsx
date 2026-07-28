"use client";

import { useEffect, useRef, useState } from "react";
import { formatMinutos } from "@/lib/dates";

export function AnimatedNumber({
  value,
  duration = 700,
  unidad = "numero",
}: {
  value: number;
  duration?: number;
  unidad?: "numero" | "minutos";
}) {
  const [mostrado, setMostrado] = useState(0);
  const inicioRef = useRef<number | null>(null);

  useEffect(() => {
    inicioRef.current = null;
    let frame: number;

    function tick(timestamp: number) {
      if (inicioRef.current === null) inicioRef.current = timestamp;
      const progreso = Math.min(1, (timestamp - inicioRef.current) / duration);
      const facilitado = 1 - Math.pow(1 - progreso, 3);
      setMostrado(Math.round(facilitado * value));
      if (progreso < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <span>{unidad === "minutos" ? formatMinutos(mostrado) : mostrado}</span>;
}
