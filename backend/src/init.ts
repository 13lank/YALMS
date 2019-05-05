import "reflect-metadata";
import { createConnection } from "typeorm";
import { Admin } from "./entity/Admin";
import { genSalt, sha512 } from "./utils";

createConnection().then(async connection => {

    console.log("Inserting a new user into the database...");
    const admin = new Admin();
    admin.Contact = "test@zju.edu.cn";
    admin.AdminName = "test_admin";
    admin.PwdSalt = genSalt();
    admin.PwdHash = sha512('123456', admin.PwdSalt);
    await connection.manager.save(admin);
    console.log("Saved a new admin with id: " + admin.AdminName);

    console.log("Loading admins from the database...");
    const admins = await connection.manager.find(Admin);
    console.log("Loaded admins: ", admins);

    console.log("Here you can setup and run express/koa/any other framework.");
    return;

}).catch(error => console.log(error));
