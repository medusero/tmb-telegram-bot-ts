import { type LineArrival } from "./tmbApi.js";
import { type FavoriteEntries } from "./favorites.js";
import { TZDate } from "@date-fns/tz";
import { format, differenceInMinutes } from "date-fns";

const TZ = "Europe/Madrid";

export function startMessage(): string {
  const messageLines = [
    "Este bot puede obtener tiempos de llegadas de buses TMB.",
    "Escribe /ayuda para una lista de opciones disponibles.",
  ];
  return messageLines.join("\n");
}

export function helpMessage(): string {
  const messageLines = [
    "Escribe un código de parada directamente",
    "Guarda una parada favorita con /guardar",
    "Lista tus favoritos con /favoritos",
    "Borra una parada favorita con /borrar",
    "Cancela una operación con /cancelar",
  ];
  return messageLines.join("\n");
}

export function formatFavorites(favorites: FavoriteEntries): string {
  const lines = favorites.map(([alias, code]) => `${alias}: ${code}`);
  const favoritesText = lines.join("\n");
  return favoritesText;
}

export function formatArrivalTime(arrivalEpoch: number, now: TZDate): string {
  const arrivalTime = new TZDate(arrivalEpoch, TZ);
  const relativeMinutes = differenceInMinutes(arrivalTime, now, {
    roundingMethod: "round",
  });
  const absoluteTime = format(arrivalTime, "HH:mm");
  return `${absoluteTime} (${relativeMinutes}m.)`;
}

export function formatArrivals(arrivals: LineArrival[]): string {
  const now = new TZDate(new Date(), TZ);
  const linesText = arrivals.map((line) => {
    const arrivalTimesText = line.arrivalTimes
      .map((epoch) => {
        return formatArrivalTime(epoch, now);
      })
      .join(", ");
    return `Línea ${line.lineName}: ${arrivalTimesText}`;
  });
  return linesText.join("\n");
}
