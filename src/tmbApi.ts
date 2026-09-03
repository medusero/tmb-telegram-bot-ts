import { z, ZodError } from "zod";
import { URLSearchParams } from "node:url";
import { config } from "./config.js";

class TmbApiError extends Error {
  status: number;
  constructor(status: number) {
    super(`Error de la API: Código de estado ${status}`);
    this.name = "TmbApiError";
    this.status = status;
  }
}

class NetworkError extends Error {
  constructor(
    cause: unknown,
    message: string = "No se pudo conectar con la API",
  ) {
    super(message, {
      cause,
    });
    this.name = "NetworkError";
  }
}

class InvalidResponseShapeError extends Error {
  constructor(
    cause: unknown,
    message: string = "La respuesta de la API no tiene el formato esperado",
  ) {
    super(message, {
      cause,
    });
    this.name = "InvalidResponseShapeError";
  }
}

class InvalidJsonError extends Error {
  constructor(
    cause: unknown,
    message: string = "La API no responde con ningún formato aceptable",
  ) {
    super(message, { cause });
    this.name = "InvalidJsonError";
  }
}

class TimeoutError extends NetworkError {
  constructor(
    cause: unknown,
    message: string = "La API está tardando en responder",
  ) {
    super(cause, message);
    this.name = "TimeoutError";
  }
}

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
      throw new TimeoutError(cause);
    } else {
      throw new NetworkError(cause);
    }
  }
}

export async function getArrivals(stopCode: string) {
  const response = await fetchArrivalsResponse(stopCode);
  if (!response.ok) {
    throw new TmbApiError(response.status);
  }
  try {
    const rawObject = apiSchema.parse(await response.json());
    return toLineArrivals(rawObject.parades[0]!.linies_trajectes);
  } catch (cause) {
    if (cause instanceof ZodError) {
      throw new InvalidResponseShapeError(cause);
    } else if (cause instanceof SyntaxError) {
      throw new InvalidJsonError(cause);
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
