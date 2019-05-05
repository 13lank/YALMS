import { User } from "../../entity/User";
import { createConnection, getConnection } from "typeorm";
import { sha512, genSalt } from "../../utils";
const Router = require('koa-router')
export const userRouter = new Router()


userRouter.post('/register', async (ctx) => {
  const data = ctx.request.body;
  console.log("Creating user:", data);
  try {
    let user = new User();
    user.Name = data['Name'];
    user.PwdSalt = genSalt();
    user.PwdHash = sha512(data['Password'], user.PwdSalt);
    user.Records = [];
    user.Dept = data['Dept'];
    user.CardId = data['CardId'];
    await getConnection().manager.save(user);
    ctx.body = { 'status': true, 'info': "User Created! CardId: " + user.CardId };
  }
  catch (err) {
    console.log("Failed to create user:", err);
    ctx.body = { 'status': false, 'info': err };
  }
});

userRouter.get('/allusers', async (ctx) => {
  console.log("Querying all user info...");
  try {
    let userRepository = getConnection().getRepository(User);
    let allUsers = await userRepository.find();
    console.log("Query succeeded!");
    ctx.body = { 'status': true, 'info': allUsers };
  }
  catch (err) {
    console.log("Query Failed! ", err);
    ctx.body = { 'status': false, 'info': err };
  }
});

userRouter.post('/delete', async (ctx) => {
  let CardId = ctx.request.body.CardId;
  console.log("Deleting user, CardId: ", CardId);
  try {
    let userRepository = getConnection().getRepository(User);
    const target_user = await userRepository.findOne({ CardId: CardId });
    userRepository.remove(target_user);
    console.log("Deleted User: ", target_user.Name);
    ctx.body = { 'status': true, 'info': target_user };
  }
  catch (err) {
    console.log("Deletion Failed! ", err);
    ctx.body = { 'status': false, 'info': err };
  }
});
