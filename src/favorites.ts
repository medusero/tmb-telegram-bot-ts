import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z, ZodError } from "zod";
import { readFile, writeFile } from "node:fs/promises";
import { AppTextError } from "./errors.js";

const modulePath = fileURLToPath(import.meta.url);
const moduleDir = dirname(modulePath);
const joinPath = join(moduleDir, "..", "data", "favorites.json");
const cleanPath = resolve(joinPath);

const favoritesSchema = z.record(z.string(), z.string());

type Favorites = z.infer<typeof favoritesSchema>;
export type FavoriteEntries = [string, string][];

export async function loadFavorites(): Promise<Favorites> {
  try {
    const favoritesText = await readFile(cleanPath, "utf-8");
    const favoritesParsed = JSON.parse(favoritesText);
    return favoritesSchema.parse(favoritesParsed);
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return {};
    } else if (error instanceof ZodError) {
      throw new AppTextError("invalidFavoriteShape", error);
    } else if (error instanceof SyntaxError) {
      throw new AppTextError("corruptFavoriteFile", error);
    } else {
      throw error;
    }
  }
}

export async function saveFavorites(favorites: Favorites): Promise<void> {
  try {
    const favoritesFile = JSON.stringify(favorites, null, 4);
    await writeFile(cleanPath, favoritesFile);
  } catch (cause) {
    throw new AppTextError("favoritesSaveError", cause);
  }
}

export async function deleteFavorites(alias: string): Promise<string> {
  const favorites = await loadFavorites();
  const { [alias]: extractedValue, ...rest } = favorites;
  if (extractedValue === undefined) {
    throw new AppTextError("favoriteNotFound");
  }
  await saveFavorites(rest);
  return extractedValue;
}

export async function addFavorite(alias: string, code: string): Promise<void> {
  const favorites = await loadFavorites();
  const newFavorites = { ...favorites, [alias]: code };
  await saveFavorites(newFavorites);
}

export async function listFavorites(): Promise<FavoriteEntries> {
  const favorites = Object.entries(await loadFavorites());
  return favorites;
}
