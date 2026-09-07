import { getArrivals } from "./tmbApi.js";
import { listFavorites } from "./favorites.js";
import { Bot, Context, type NextFunction } from "grammy";
import { config } from "./config.js";
import { formatArrivals, formatFavorites } from "./formatting.js";
import { AppError } from "./errors.js";

const bot = new Bot(config.TELEGRAM_BOT_TOKEN);

async function authResponse(ctx: Context, next: NextFunction): Promise<void> {
  if (ctx.from !== undefined && ctx.from.id === config.TELEGRAM_USER_ID) {
    await next();
  } else {
    await ctx.reply(
      "Tu usuario no está registrado; contacta con el administrador del bot",
    );
  }
}

bot.use(authResponse);

bot.hears(/^\d{1,4}$/, async (ctx) => {
  const stopCode = ctx.match[0];
  const arrivals = await getArrivals(stopCode);
  if (arrivals.length === 0) {
    await ctx.reply("Esta parada no tiene líneas con datos ahora mismo");
  } else {
    await ctx.reply(formatArrivals(arrivals));
  }
});

bot.command("start", (ctx) => ctx.reply("Iniciado"));
bot.command("ayuda", (ctx) => ctx.reply("Texto temporal de ayuda"));
bot.command("favoritos", async (ctx) => {
  const entries = await listFavorites();
  if (entries.length === 0) {
    await ctx.reply("No tienes ningún favorito guardado");
  } else {
    await ctx.reply(formatFavorites(entries));
  }
});
bot.on("message", async (ctx) => await ctx.reply("No he entendido tu mensaje"));

bot.catch(async (err) => {
  if (err.error instanceof AppError) {
    await err.ctx.reply(err.error.message);
  } else {
    console.error(err.error);
    await err.ctx.reply("Ha ocurrido un error no previsto");
  }
});
bot.start();
