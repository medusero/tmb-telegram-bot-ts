import { prettifyError, z } from "zod";

const envSchema = z.object({
  TMB_APP_ID: z.string().min(6),
  TMB_APP_KEY: z.string().min(6),
  TELEGRAM_BOT_TOKEN: z.string().regex(/^\d{6,15}:[A-Za-z0-9_-]{35}$/),
  TELEGRAM_USER_ID: z
    .string()
    .regex(/^[0-9]{4,15}$/)
    .transform(Number),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(prettifyError(result.error));
  process.exit(1);
}

export const config = result.data;
