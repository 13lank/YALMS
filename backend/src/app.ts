import bodyParser = require("koa-bodyparser");
import { indexRouter } from "./router";
import { createConnection } from "typeorm";
const myoath = require('./mid/auth');
const Koa = require('koa');
const app = new Koa();
const session = require('koa-session')
const connection = createConnection();
const CONFIG = {
  key: 'library-sess:', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.keys = ['zjudbcourse'];
app.use(session(CONFIG, app));
app.use(bodyParser());
app.use(myoath);
app.use(indexRouter.routes()).use(indexRouter.allowedMethods());
const server = app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
  console.log('Press CTRL-C to stop \n');
});