import { Markup, Telegraf } from "telegraf";
import { message } from "telegraf/filters";

const bot = new Telegraf(process.env.BOT_TOKEN);

const GAME_COUNT = parseInt(process.env.GAME_COUNT);

// This doesnt work, check later
// bot.settings(async (ctx) => {
//   await ctx.telegram.setMyCommands([
//     {
//       command: "/start",
//       description: "Welcomes to user",
//     },
//     {
//       command: "/help",
//       description: "Detailed instructions",
//     },
//     {
//       command: "/games",
//       description: "Lists all games",
//     },
//   ]);
//   return ctx.reply("Ok");
// });

bot.start((ctx) => ctx.reply("Welcome"));

bot.help(async (ctx) => {
  const commands = await ctx.telegram.getMyCommands();
  const info = commands.reduce(
    (acc, val) => `${acc}/${val.command} - ${val.description}\n`,
    ""
  );
  return ctx.reply(info);
});

bot.command("games", async (ctx) => {
  const keyboard = Markup.inlineKeyboard(
    Array.from({ length: GAME_COUNT }, (_, idx) => `${++idx}`).map((e) =>
      Markup.button.webApp(
        process.env[`BOT_GAME_${e}_NAME`],
        process.env[`BOT_GAME_${e}_URL`]
      )
    )
  );
  return ctx.reply("Select a game to play now:", keyboard);
});

// const keyboard = Markup.inlineKeyboard([
//   Markup.button.callback("✅", "like"),
//   Markup.button.callback("❌", "dislike"),
// ]);

// const isCommandMsg = (ctx) => ctx.message.text.startsWith("/");

// bot.on(message('text'), (ctx) => {
//   if (isCommandMsg(ctx)) {
//     ctx.reply("Unknown command, type /help for all commands.")
//   } else {
//     ctx.copyMessage(ctx.message.chat.id, keyboard);
//   }
// });


bot.launch({
  webhook: {
    domain: process.env.BOT_PUBLIC_DOMAIN,
    port: process.env.BOT_PORT,
  },
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

