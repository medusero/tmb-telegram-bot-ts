import { type es } from "./messages.js";

export abstract class AppError extends Error {}

export class AppTextError extends AppError {
  constructor(
    public key: keyof typeof es.errors.common,
    cause?: unknown,
  ) {
    super(key, {
      cause,
    });
    this.name = key;
  }
}

export class AppDataError extends AppError {
  constructor(
    public key: keyof typeof es.errors.templates,
    public status: number,
    cause?: unknown,
  ) {
    super(key, { cause });
    this.name = key;
  }
}
