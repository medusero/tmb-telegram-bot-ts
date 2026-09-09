import { getArrivals } from "./tmbApi.js";
import { addFavorite, listFavorites } from "./favorites.js";
import { config } from "./config.js";
import { formatArrivals, formatFavorites } from "./formatting.js";
import { AppError } from "./errors.js";
import {
  Bot,
  Context,
  session,
  type NextFunction,
  type SessionFlavor,
} from "grammy";

type NoneState = { state: "none" };
type WaitingAliasState = { state: "waitingAlias" };
type WaitingCodeState = { state: "waitingCode"; alias: string };
type State = NoneState | WaitingAliasState | WaitingCodeState;
type MyContext = Context & SessionFlavor<State>;

const bot = new Bot<MyContext>(config.TELEGRAM_BOT_TOKEN);

async function authResponse(ctx: Context, next: NextFunction): Promise<void> {
  if (ctx.from !== undefined && ctx.from.id === config.TELEGRAM_USER_ID) {
    await next();
  } else {
    await ctx.reply(
      "Tu usuario no está registrado; contacta con el administrador del bot",
    );
  }
}

function initial(): State {
  return { state: "none" };
}

async function handleSaveStep(
  ctx: MyContext,
  next: NextFunction,
): Promise<void> {
  switch (ctx.session.state) {
    case "none":
      await next();
      break;
    case "waitingAlias":
      if (!ctx.message?.text) {
        await ctx.reply("Escríbeme el alias como mensaje de texto");
      } else {
        const alias = ctx.message?.text;
        ctx.session = { state: "waitingCode", alias };
        await ctx.reply("¿Cuál es el código de parada?");
      }
      break;
    case "waitingCode":
      if (!ctx.message?.text) {
        await ctx.reply("Escríbeme el código como mensaje de texto");
      } else {
        const code = ctx.message?.text;
        await getArrivals(code);
        const alias = ctx.session.alias;
        await addFavorite(alias, code);
        await ctx.reply(`Nuevo favorito guardado: ${alias}: ${code}`);
        ctx.session = { state: "none" };
      }
      break;
    default: {
      const exhaustiveCheck: never = ctx.session;
      throw new Error(`Error inesperado: ${JSON.stringify(exhaustiveCheck)}`);
    }
  }
}

bot.use(authResponse);
bot.use(session({ initial }));
bot.use(handleSaveStep);
bot.command("cancelar");
bot.command("guardar");

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
