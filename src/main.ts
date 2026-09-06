import { getArrivals } from "./tmbApi.js";
import { loadFavorites, saveFavorites, listFavorites } from "./favorites.js";
import { Bot, Context, type NextFunction } from "grammy";
import { config } from "./config.js";

const bot = new Bot(config.TELEGRAM_BOT_TOKEN);

async function authResponse(ctx: Context, next: NextFunction): Promise<void> {
  if (ctx.from !== undefined && ctx.from.id === config.TELEGRAM_USER_ID) {
    await next();
  } else {
    console.log(
      "Tu usuario no está registrado; contacta con el administrador del bot",
    );
  }
}

bot.use(authResponse);

bot.command("start", (ctx) => ctx.reply("Iniciado"));
bot.command("help", (ctx) => ctx.reply("Texto temporal de ayuda"));

bot.start();
