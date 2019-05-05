import { adminRouter } from "./admin/admin";
import { commonRouter } from "./common/common";
const Router = require('koa-router')

export const indexRouter = new Router();

indexRouter.use('/admin', adminRouter.routes(), adminRouter.allowedMethods());
indexRouter.use('/common', commonRouter.routes(), commonRouter.allowedMethods());