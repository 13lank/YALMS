import { createSecureContext } from "tls";

module.exports = async (ctx, next) => {
  if (ctx.url.slice(0, 6) === '/admin') {
    if (ctx.session.admin !== undefined) await next();
    else ctx.body = {
      "status": false,
      "info": "No Permission"
    }
    return;
  }
  else {
    await next();
    return;
  }
}