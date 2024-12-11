import { Markup, Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Type /games to list all games.'))
bot.command('games', async (ctx) => {
    return ctx.reply(
        'Select a game to play now:',
        Markup.inlineKeyboard([
          Markup.button.webApp("Game #1", process.env.BOT_GAME_1_URL),
          Markup.button.webApp("Game #2", process.env.BOT_GAME_2_URL),

        ])
      )
})

bot.action('Dr Pepper', (ctx, next) => {
    return ctx.reply('👍').then(() => next())
  })



bot.launch({
    webhook: {
        domain: process.env.BOT_PUBLIC_DOMAIN,
        port: process.env.BOT_PORT
    }
})


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))