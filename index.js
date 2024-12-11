import { Markup, Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.settings(async ctx => {
	await ctx.telegram.setMyCommands([
		{
			command: "/start",
			description: "Welcomes to user",
		},
		{
			command: "/help",
			description: "Gives instructions",
		},
		{
			command: "/games",
			description: "Lists all games",
		},
	]);
	return ctx.reply("Ok");
});

bot.start((ctx) => ctx.reply('Welcome'))

bot.help(async ctx => {
	const commands = await ctx.getMyCommands();
	const info = commands.reduce(
		(acc, val) => `${acc}/${val.command} - ${val.description}\n`,
		"",
	);
	return ctx.reply(info);
});


bot.command('games', async (ctx) => {
    return ctx.reply(
        'Select a game to play now:',
        Markup.inlineKeyboard([
          Markup.button.webApp("Game #1", process.env.BOT_GAME_1_URL),
          Markup.button.webApp("Game #2", process.env.BOT_GAME_2_URL),

        ])
      )
})

const keyboard = Markup.inlineKeyboard([
	Markup.button.url("❤️", "http://telegraf.js.org"),
	Markup.button.callback("Delete", "delete"),
]);

bot.on("message", ctx => ctx.copyMessage(ctx.message.chat.id, keyboard));
bot.action("delete", ctx => ctx.deleteMessage());



bot.launch({
    webhook: {
        domain: process.env.BOT_PUBLIC_DOMAIN,
        port: process.env.BOT_PORT
    }
})




// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))