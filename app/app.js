import Koa from 'koa';
import config from 'config';
import mongoose from 'mongoose';
import koaBody from 'koa-body';
import logger from 'koa-logger';
import path from 'path';
import err from './middleware/error';

import { bot } from './telegrambot';

// import router from './router';

mongoose.set('debug', true);
mongoose.connect(config.mongodb.url, config.mongodb.opts); // , config.mongodb.options
mongoose.connection.on('error', console.error);

const app = new Koa();

app.use(logger())
  .use(err)
  .use(koaBody())
// .use(koaCors({ credentials: true }))
// .use(router.routes())
// .use(router.allowedMethods());

app.listen(config.server.port, function() {
  console.log('%s listening at port %d', config.app.name, config.server.port);
});
