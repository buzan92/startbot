import nodemailer from 'nodemailer';
import config from 'config';

export const sendMail = async (content) => {
  let result = false;

  // setup email data with unicode symbols
  const mailOptions = {
    from: config.app.emailLogin, // sender address
    to: [config.app.destemail, 'buzan92@yandex.ru'], // list of receivers
    subject: 'Сообщение от бота "pollstartup"', // Subject line
    html: content, // html body
  };

  const transport = await nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    logger: true,
    
    // service: "Yandex",
    auth: {
      user: config.app.emailLogin,
      pass: config.app.emailPassword,
    },
  });
  console.log('user:', config.app.emailLogin);
  console.log('pass:', config.app.emailPassword);
  await transport.verify(function(error, success) {
    if (error) {
         console.log(error);
    } else {
         console.log('Server is ready to take our messages');
    }
 });

  console.log('create transport');
  await transport.sendMail(mailOptions).then(() => {
    result = true;
  })
    .catch((err) => {
      console.log('send mail error', err);
    });
  return result;
};
