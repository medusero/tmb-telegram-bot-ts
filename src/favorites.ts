import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z, ZodError } from "zod";
import { readFile } from "node:fs/promises";
import { AppError } from "./errors.js";

const modulePath = fileURLToPath(import.meta.url);
const moduleDir = dirname(modulePath);
const joinPath = join(moduleDir, "..", "data", "favorites.json");
const cleanPath = resolve(joinPath);

const favoritesSchema = z.record(z.string(), z.string());
type Favorites = z.infer<typeof favoritesSchema>;

class CorruptFavoritesFileError extends AppError {
  constructor(
    cause: unknown,
    message: string = "El archivo de favoritos está corrupto",
  ) {
    super(message, { cause });
    this.name = "CorruptFavoritesFileError";
  }
}

class InvalidFavoritesShapeError extends AppError {
  constructor(
    cause: unknown,
    message: string = "El archivo de favoritos no tiene una forma reconocible",
  ) {
    super(message, { cause });
    this.name = "InvalidFavoritesShapeError";
  }
}

export async function loadFavorites(): Promise<Favorites> {
  try {
    const favoritesText = await readFile(cleanPath, "utf-8");
    const favoritesParsed = JSON.parse(favoritesText);
    return favoritesSchema.parse(favoritesParsed);
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return {};
    } else if (error instanceof ZodError) {
      throw new InvalidFavoritesShapeError(error);
    } else if (error instanceof SyntaxError) {
      throw new CorruptFavoritesFileError(error);
    } else {
      throw error;
    }
  }
}
