import User from '../models/user';
import Quiz from '../models/quiz';
import { sendMail } from '../controllers/utils';

export const getUserState = async (chatid, from) => {
  let user = await findUser(chatid);
  if (!user) {
    user = await createUser(chatid, from);
  }
  return {
    state: user.state,
    callbackData: user.callbackData,
    questionIdx: user.questionIdx,
  };
};

export const setUserState = async (chatid, state = 'start', callbackData = '', questionIdx = 0) => {
  await User.findOneAndUpdate({ chatid },
    {
      $set: { state, callbackData, questionIdx }
    })
    .catch((err) => {
      throw new Error(`error while set user state: ${err.message}`);
    })
};

export const resetQuiz = async (chatid) => {
  await Quiz.findOneAndRemove({ chatid })
    .catch((err) => {
      throw new Error(`error while remove quiz document: ${err.message}`);
    });
}

export const updateQuiz = async (chatid, question, answer) => {
  const questionObj = { question, answer };
  console.log('qObj', questionObj);
  await Quiz.findOneAndUpdate({ chatid }, {
     $push: { questions: questionObj }
  },{ upsert: true })
  .catch((err) => {
    throw new Error(`error while push question to quiz: ${err.message}`);
  });
};

export const finishQuiz = async (chatid) => {
  const user = await User.findOne({ chatid });
  const quiz = await Quiz.findOne({ chatid });
  let content = `Пользователь ${user.username} (${user.firstname} ${user.lastname}) заполнил анкету\n\n`;
  quiz.questions.forEach((question) => {
    content += `${question.question}\n${question.answer}\n\n`;
  });
  await sendMail(content);
};

const findUser = async (chatid) => { // from,
  let user = await User.findOne({ chatid })
    .catch((err) => {
      throw new Error(`error while find user in db: ${err.message}`);
    });
  return user;
};

const createUser = async (chatid, from) => {
  try {
    const user = new User({
      chatid,
      languagecode: from.language_code,
      isbot: from.is_bot,
      firstname: from.first_name,
      lastname: from.last_name,
      username: from.username,
      state: 'start',
      callbackData: '',
      questionIdx: 0,
    });
    await user.save();
    return user;
  } catch (err) {
    throw new Error(`error while add new user into db: ${err.message}`);
  }
};
