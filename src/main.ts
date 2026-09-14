import { getArrivals } from "./tmbApi.js";
import { addFavorite, deleteFavorites, listFavorites } from "./favorites.js";
import { config } from "./config.js";
import {
  formatArrivals,
  formatFavorites,
  formatFavoriteSaved,
} from "./formatting.js";
import { AppError } from "./errors.js";
import {
  type LanguageFlavor,
  resolveErrorMessage,
  resolveLanguage,
  t,
} from "./i18n.js";
import {
  Bot,
  Context,
  InlineKeyboard,
  session,
  type NextFunction,
  type SessionFlavor,
} from "grammy";

type NoneState = { state: "none" };
type WaitingAliasState = { state: "waitingAlias" };
type WaitingCodeState = { state: "waitingCode"; alias: string };
type State = NoneState | WaitingAliasState | WaitingCodeState;
type MyContext = Context & LanguageFlavor & SessionFlavor<State>;

const bot = new Bot<MyContext>(config.TELEGRAM_BOT_TOKEN);

async function userLanguage(ctx: MyContext, next: NextFunction): Promise<void> {
  ctx.language = resolveLanguage(ctx.from?.language_code);
  await next();
}

async function authResponse(ctx: MyContext, next: NextFunction): Promise<void> {
  if (ctx.from !== undefined && ctx.from.id === config.TELEGRAM_USER_ID) {
    await next();
  } else {
    await ctx.reply(t(ctx.language, "notRegistered"));
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
        await ctx.reply(t(ctx.language, "aliasMustBeText"));
      } else {
        const alias = ctx.message?.text;
        ctx.session = { state: "waitingCode", alias };
        await ctx.reply(t(ctx.language, "askStopCode"));
      }
      break;
    case "waitingCode":
      if (!ctx.message?.text) {
        await ctx.reply(t(ctx.language, "codeMustBeText"));
      } else {
        const code = ctx.message?.text;
        await getArrivals(code);
        const alias = ctx.session.alias;
        await addFavorite(alias, code);
        await ctx.reply(formatFavoriteSaved(ctx.language, alias, code));
        ctx.session = { state: "none" };
      }
      break;
    default: {
      const exhaustiveCheck: never = ctx.session;
      throw new Error(`Error inesperado: ${JSON.stringify(exhaustiveCheck)}`);
    }
  }
}

bot.use(userLanguage);
bot.use(authResponse);

bot.use(session({ initial }));

bot.command("cancelar", async (ctx) => {
  ctx.session = { state: "none" };
  await ctx.reply(t(ctx.language, "cancelled"));
});

bot.command("guardar", async (ctx) => {
  ctx.session = { state: "waitingAlias" };
  await ctx.reply(t(ctx.language, "askAlias"));
});

bot.use(handleSaveStep);

bot.callbackQuery(/delete:(\d{1,2})/, async (ctx) => {
  const index = Number(ctx.match[1]);
  const favorites = await listFavorites();
  if (favorites[index] === undefined) {
    await ctx.reply(t(ctx.language, "favoriteNotFound"));
    await ctx.answerCallbackQuery();
  } else {
    const [alias] = favorites[index];
    await deleteFavorites(alias);
    await ctx.answerCallbackQuery();
    const newFavorites = await listFavorites();
    if (newFavorites.length === 0) {
      await ctx.editMessageText(t(ctx.language, "noFavoritesLeft"), {
        reply_markup: new InlineKeyboard(),
      });
    } else {
      const inlineKeyboard = new InlineKeyboard();
      newFavorites.forEach(([newAlias], newIndex) => {
        inlineKeyboard.text(newAlias, `delete:${newIndex}`).row();
      });
      await ctx.editMessageText(t(ctx.language, "deleteAnotherFavorite"), {
        reply_markup: inlineKeyboard,
      });
    }
  }
});

bot.hears(/^\d{1,4}$/, async (ctx) => {
  const stopCode = ctx.match[0];
  const arrivals = await getArrivals(stopCode);
  if (arrivals.length === 0) {
    await ctx.reply(t(ctx.language, "noDataForStop"));
  } else {
    await ctx.reply(formatArrivals(ctx.language, arrivals));
  }
});

bot.command("start", (ctx) => ctx.reply(t(ctx.language, "start")));

bot.command("ayuda", (ctx) => ctx.reply(t(ctx.language, "help")));

bot.command("favoritos", async (ctx) => {
  const entries = await listFavorites();
  if (entries.length === 0) {
    await ctx.reply(t(ctx.language, "noFavoritesSaved"));
  } else {
    await ctx.reply(formatFavorites(entries));
  }
});

bot.command("borrar", async (ctx) => {
  const entries = await listFavorites();
  if (entries.length === 0) {
    await ctx.reply(t(ctx.language, "noFavoritesSaved"));
  } else {
    const inlineKeyboard = new InlineKeyboard();
    entries.forEach(([alias], index) => {
      inlineKeyboard.text(alias, `delete:${index}`).row();
    });
    await ctx.reply(t(ctx.language, "chooseFavoriteToDelete"), {
      reply_markup: inlineKeyboard,
    });
  }
});

bot.on(
  "message",
  async (ctx) => await ctx.reply(t(ctx.language, "notUnderstood")),
);

bot.catch(async (err) => {
  if (err.error instanceof AppError) {
    await err.ctx.reply(resolveErrorMessage(err.ctx.language, err.error));
  } else {
    console.error(err.error);
    await err.ctx.reply(t(err.ctx.language, "unexpectedError"));
  }
});

const stopBot = async () => {
  try {
    console.log("Deteniendo bot de forma ordenada...");
    await bot.stop();
    await botState;
    console.log("Bot detenido correctamente");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

process.once("SIGINT", stopBot);
process.once("SIGTERM", stopBot);

const botState = bot.start();
