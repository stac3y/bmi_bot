const {Telegraf} = require('telegraf');
require('custom-env').env('staging');
const WizardScene = require('telegraf/scenes/wizard')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')

const bot = new Telegraf(process.env.BOT_TOKEN);

const createScene = new WizardScene('createScene',
    (ctx)=> {
    ctx.reply('1. Введите ваш вес:')
    }
    );

const stage = new Stage();
stage.register(createScene);

bot.use(session());
bot.use(stage.middleware())

bot.start((ctx) => {
    ctx.scene.enter('createScene');
})

bot.launch().then(res => {
    console.log('Started')
})
    .catch(err => console.log(err));