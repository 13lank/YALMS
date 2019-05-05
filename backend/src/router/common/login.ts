import { getConnection } from "typeorm";
import { User } from "../../entity/User";
import { sha512 } from "../../utils";
import { Admin } from "../../entity/Admin";
import { createSecureContext } from "tls";

const Router = require('koa-router')
export const loginRouter = new Router();
loginRouter.post('/userlogin', async ctx => {
  let data = ctx.request.body;
  try {
    const userRepo = getConnection().getRepository(User);
    let targetUser = await userRepo.findOneOrFail({ CardId: data.CardId })
      .catch(err => {
        throw "User not found, CardId:" + data.CardId;
      });
    let PwdHash = sha512(data.Password, targetUser.PwdSalt);
    if (PwdHash !== targetUser.PwdHash) throw "Wrong Password";
    ctx.session.admin = undefined;
    ctx.session.user = targetUser;
    console.log('Login succeeded! CardId:', data.CardId);
    ctx.body = { 'status': true, 'info': 'Login succeeded! CardId:' + data.CardId };
  } catch (error) {
    console.log('Login Failed:', error);
    ctx.body = { 'status': false, info: error };
  }
});

loginRouter.post('/adminlogin', async ctx => {
  let data = ctx.request.body;
  try {
    const adminRepo = getConnection().getRepository(Admin);
    let targetAdmin = await adminRepo.findOneOrFail({ AdminName: data.AdminName })
      .catch(err => {
        throw "Admin not found, AdminName:" + data.AdminName;
      });
    let PwdHash = sha512(data.Password, targetAdmin.PwdSalt);
    if (PwdHash !== targetAdmin.PwdHash) throw "Wrong Password";
    ctx.session.admin = targetAdmin;
    ctx.session.user = undefined;
    console.log('Login succeeded! AdminName:', data.AdminName);
    ctx.body = { 'status': true, 'info': 'Login succeeded! AdminName:' + data.AdminName };
  } catch (error) {
    console.log('Login Failed:', error);
    ctx.body = { 'status': false, info: error };
  }
});

loginRouter.post('/logout', async ctx => {
  ctx.session.admin = undefined;
  ctx.session.user = undefined;
  console.log("Logout succeeded!");
  ctx.body = { 'status': true, 'info': "Logout succeeded!" };
})

loginRouter.get('/status', async ctx => {
  if (ctx.session.admin !== undefined) {
    ctx.body = {
      'status': true, 'type': 'admin', 'userinfo': {
        'AdminName': ctx.session.admin.AdminName
      }
    };
  }
  else if (ctx.session.user !== undefined) {
    ctx.body = {
      'status': true, 'type': 'user', 'userinfo': {
        'CardId': ctx.session.user.CardId,
        'Name': ctx.session.user.Name
      }
    };
  }
  else ctx.body = {
    'status': false
  };
})