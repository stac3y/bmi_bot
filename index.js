const {Telegraf} = require('telegraf');
require('custom-env').env('staging');
const WizardScene = require('telegraf/scenes/wizard')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')

const bmiValue = require('./bmiValue')
const bot = new Telegraf(process.env.BOT_TOKEN);

const createScene = new WizardScene('createScene',
    (ctx) => {
        ctx.reply('1. Введите ваш вес (кг):');
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.weight = parseInt(ctx.message.text, 10);
        ctx.reply('2. Введите ваш рост (см):');
        return ctx.wizard.next();
    },
    (ctx)=>{
        ctx.wizard.state.height = parseInt(ctx.message.text, 10)/100;
        const weight = ctx.wizard.state.weight;
        const height = ctx.wizard.state.height;
        const bmi = weight / height / height;

        ctx.reply(`Ваш ИМТ ${bmi} - ${bmiValue(bmi)}`).then(()=>{
            ctx.reply('Попробовать еще раз - /start')
        });
        return ctx.scene.leave();
    });

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