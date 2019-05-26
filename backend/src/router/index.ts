import { adminRouter } from "./admin/admin";
import { commonRouter } from "./common/common";
const Router = require('koa-router')

export const indexRouter = new Router();

indexRouter.use('/api/admin', adminRouter.routes(), adminRouter.allowedMethods());
indexRouter.use('/api/common', commonRouter.routes(), commonRouter.allowedMethods());