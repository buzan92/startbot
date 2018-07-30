import TelegramBot from 'node-telegram-bot-api';
import config from 'config';

import c from './constants';
import {
  getUserState,
  setUserState,
  updateQuiz,
  resetQuiz,
  finishQuiz,
} from './controllers/telegram.controller';

const TOKEN = config.app.telegramToken;
export const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, async function(msg, match) {
  await getUserState(msg.chat.id, msg.from);
  bot.sendMessage(msg.chat.id, c.startMessage, startKeyboard);
});

bot.on('callback_query', async function(msg) {
  c.quiz.forEach(async quiz => { //TODO: async ??
    if (quiz.callbackData === msg.data) {
      await setUserState(msg.message.chat.id, 'quiz', quiz.callbackData, 1);
      await resetQuiz(msg.message.chat.id);
      const message = `Вопрос 1 из ${quiz.questions.length}\n${quiz.questions[0]}`;
      bot.sendMessage(msg.message.chat.id, message);
    }
  });
});

bot.on('message', async (msg) => {
  console.log('msg:', msg);
  if (msg.text && msg.text === '/start') { //TODO: regular expression
    return;
  }
  const { state, callbackData, questionIdx } = await getUserState(msg.chat.id, msg.from);
  switch (state) {
    case 'start':
      bot.sendMessage(msg.chat.id, c.startMessage, startKeyboard);
    break;
    case 'quiz':
      const questions = c.quiz.find((quiz) => quiz.callbackData === callbackData).questions;
      if (questionIdx < questions.length) {
        await updateQuiz(msg.chat.id, questions[questionIdx - 1], msg.text);
        await setUserState(msg.chat.id, 'quiz', callbackData, questionIdx + 1);
        const message = `Вопрос ${questionIdx + 1} из ${questions.length}\n${questions[questionIdx]}`;
        bot.sendMessage(msg.chat.id, message);
      } else {
        await updateQuiz(msg.chat.id, questions[questionIdx - 1], msg.text);
        const result = await finishQuiz(msg.chat.id);
        console.log('res', result);
        bot.sendMessage(msg.chat.id, c.finishMessage);
      }
    break;

    case 'finish':

    break;
    default:
      console.log('default');
  }
});

/*
const sendStartMessage() {

}
*/

const inline_keyboard = c.quiz.reduce((acc, quiz) => {
  const button = [{}];
  button[0].text = quiz.intend;
  button[0].callback_data = quiz.callbackData;
  acc.push(button);
  return acc;
}, []);

const startKeyboard = {
  reply_markup: {
    inline_keyboard
  }
};
