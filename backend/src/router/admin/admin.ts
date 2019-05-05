import { userRouter } from "./user";
import { bookRouter } from "./book";

const Router = require('koa-router');

export const adminRouter = new Router();

adminRouter.use('/user', userRouter.routes(), userRouter.allowedMethods());
adminRouter.use('/book', bookRouter.routes(), bookRouter.allowedMethods());