export default async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log('mw error', err.message);
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      msg: err.message
    };
  }
};
