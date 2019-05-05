import { bookRouter } from "./book";
import { loginRouter } from "./login";

const Router = require('koa-router');
export const commonRouter = new Router()
commonRouter.use('/book', bookRouter.routes(), bookRouter.allowedMethods());
commonRouter.use('/login', loginRouter.routes(), loginRouter.allowedMethods());