import { libraryRouter } from "./library";
import { loginRouter } from "./login";

const Router = require('koa-router');
export const commonRouter = new Router()
commonRouter.use('/library', libraryRouter.routes(), libraryRouter.allowedMethods());
commonRouter.use('/login', loginRouter.routes(), loginRouter.allowedMethods());