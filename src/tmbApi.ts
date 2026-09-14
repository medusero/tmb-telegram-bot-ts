import { z, ZodError } from "zod";
import { URLSearchParams } from "node:url";
import { config } from "./config.js";
import { AppTextError, AppDataError } from "./errors.js";

function buildArrivalsUrl(stopCode: string): string {
  const params = new URLSearchParams({
    app_id: config.TMB_APP_ID,
    app_key: config.TMB_APP_KEY,
  }).toString();
  const apiUrl = `https://api.tmb.cat/v1/itransit/bus/parades/${stopCode}?${params}`;
  return apiUrl;
}

const lineSchema = z.object({
  nom_linia: z.string().min(1),
  propers_busos: z.array(
    z.object({
      temps_arribada: z.number(),
    }),
  ),
});

type RawLine = z.infer<typeof lineSchema>;

const apiSchema = z.object({
  parades: z
    .array(
      z.object({
        linies_trajectes: z.array(lineSchema),
      }),
    )
    .nonempty(),
});

async function fetchArrivalsResponse(stopCode: string) {
  try {
    const response = await fetch(buildArrivalsUrl(stopCode), {
      signal: AbortSignal.timeout(10000),
    });
    return response;
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "TimeoutError") {
      throw new AppTextError("timeout", cause);
    } else {
      throw new AppTextError("networkError", cause);
    }
  }
}

export async function getArrivals(stopCode: string) {
  const stopCodeNumber = Number(stopCode);
  const stopCodeString = String(stopCodeNumber);
  const response = await fetchArrivalsResponse(stopCodeString);
  if (!response.ok) {
    throw new AppDataError("tmbApiError", response.status);
  }
  try {
    const rawObject = apiSchema.parse(await response.json());
    return toLineArrivals(rawObject.parades[0]!.linies_trajectes);
  } catch (cause) {
    if (cause instanceof ZodError) {
      throw new AppTextError("invalidResponseShape", cause);
    } else if (cause instanceof SyntaxError) {
      throw new AppTextError("invalidJson", cause);
    } else {
      throw cause;
    }
  }
}

export interface LineArrival {
  lineName: string;
  arrivalTimes: number[];
}

export function toLineArrivals(rawArray: RawLine[]): LineArrival[] {
  return rawArray.map((line) => ({
    lineName: line.nom_linia,
    arrivalTimes: line.propers_busos.map((bus) => bus.temps_arribada),
  }));
}
