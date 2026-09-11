import { es, ca, en } from "./messages.js";

type SupportedLanguage = "es" | "ca" | "en";

export const registry: Record<SupportedLanguage, typeof es> = { es, ca, en };

export function resolveLanguage(
  languageCode: string | undefined,
): SupportedLanguage {
  if (languageCode === undefined) {
    return "en";
  } else if (languageCode.startsWith("es")) {
    return "es";
  } else if (languageCode.startsWith("ca")) {
    return "ca";
  } else if (languageCode.startsWith("en")) {
    return "en";
  } else {
    return "en";
  }
}

export function t(
  language: SupportedLanguage,
  key: keyof typeof es.common,
): string {
  return registry[language].common[key];
}
