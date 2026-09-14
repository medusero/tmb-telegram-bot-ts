import { es, ca, en } from "./messages.js";
import { AppError, AppTextError, AppDataError } from "./errors.js";

export type SupportedLanguage = "es" | "ca" | "en";

export type LanguageFlavor = { language: SupportedLanguage };

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

export function resolveErrorMessage(
  language: SupportedLanguage,
  error: AppError,
): string {
  if (error instanceof AppTextError) {
    return registry[language].errors.common[error.key];
  } else if (error instanceof AppDataError) {
    return registry[language].errors.templates[error.key](error.status);
  } else {
    throw new Error(
      `Nueva subclase de error no prevista: ${error.constructor.name}`,
    );
  }
}

export function t(
  language: SupportedLanguage,
  key: keyof typeof es.common,
): string {
  return registry[language].common[key];
}
