
import { Book } from "../../entity/Book";
import { getConnection } from "typeorm";
import { User } from "../../entity/User";
import { Record } from "../../entity/Record";
import { createSecureContext } from "tls";
import { SqlInMemory } from "typeorm/driver/SqlInMemory";

const Router = require('koa-router');
export const libraryRouter = new Router();
libraryRouter.get('/allbooks', async (ctx) => {
  console.log("Querying all book info...");
  try {
    let bookRepository = getConnection().getRepository(Book);
    let allBooks = await bookRepository.find();
    console.log("Query succeeded!");
    ctx.body = { 'status': true, 'info': allBooks };
  }
  catch (err) {
    console.log("Query Failed! ", err);
    ctx.body = { 'status': false, 'info': err };
  }
});
libraryRouter.get('/searchdetail', async (ctx) => {
  try {
    var params = ctx.query;
    const qry = getConnection().getRepository(Book).createQueryBuilder("book");
    var qstr = "";
    for (var key in params)
      qstr += "`" + key + "` LIKE \'%" + params[key] + "%\' AND ";
    if (qstr.length > 3) qstr = qstr.slice(0, -4);
    console.log(qstr);
    const res = await qry.where(qstr).getMany();
    console.log("Search Succeeded with", res.length, res.length > 1 ? "books" : "book");
    ctx.body = { 'status': true, 'res': res };
  }
  catch (err) {
    console.log("Search Failed! ", err);
    ctx.body = { 'status': false, 'info': err };
  }
});
libraryRouter.get('/searchfuzzy', async (ctx) => {
  var keyword = ctx.query.keyword;
  console.log("Searching books by keyword: ", keyword);
  try {
    const res = await getConnection()
      .getRepository(Book)
      .createQueryBuilder("book")
      .where("CONCAT\(`BookNo`,`BookName`,`BookType`,`Author`,`Publisher`\) LIKE :pattern", { pattern: '%' + keyword + '%' })
      .getMany();
    console.log("Search Succeeded with", res.length, res.length > 1 ? "books" : "book");
    ctx.body = { 'status': true, 'res': res };
  }
  catch (err) {
    console.log("Search Failed! ", err);
    ctx.body = { 'status': false, 'info': err };
  }
});

libraryRouter.post('/borrow', async (ctx) => {
  var BookNo = ctx.request.body.BookNo;
  console.log("Borrowing Book, BookNo:", BookNo);
  try {
    const bookRepo = getConnection().getRepository(Book);
    const recordRepo = getConnection().getRepository(Record);
    const target_book = await bookRepo.findOneOrFail({ BookNo: BookNo })
      .catch(err => {
        throw "Book Not Found, BookNo: " + BookNo;
      });
    if (target_book.Storage === 0) throw "Not Enough Storage, BookNo: " + BookNo;
    await bookRepo.update({ BookNo: target_book.BookNo }, { Storage: (target_book.Storage - 1) }).catch(err => {
      console.log(err);
      throw "update failed";
    });
    const record = new Record();
    record.Book = target_book;
    record.User = ctx.session.user;
    var date = new Date();
    record.LentDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDay();
    date.setDate(date.getDate() + 60);
    record.ReturnDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDay();
    record.Returned = false;
    await recordRepo.save(record);
    console.log("Book borrowed!");
    ctx.body = { 'status': true };

  } catch (err) {
    console.log("Failed to borrowed! ", err);
    ctx.body = { 'status': false, 'info': err };
  }
});
libraryRouter.post('/return', async ctx => {
  console.log("Returning book");
  let data = ctx.request.body;
  try {
    const recordRepo = getConnection().getRepository(Record);
    const bookRepo = getConnection().getRepository(Book);
    let record = await recordRepo.findOneOrFail({
      where: { RID: data.RID },
      relations: ["User", "Book"]
    });
    if (record.User.CardId !== ctx.session.user.CardId) throw "Invalid User";
    if (record.Returned !== false) throw "Already returned";
    await recordRepo.update({ RID: data.RID }, { Returned: true });
    await bookRepo.update({ BookNo: record.Book.BookNo }, { Storage: () => "`Storage`+1" });
    console.log("Successfully returned : " + record.Book.BookName);
    ctx.body = { 'status': true, 'info': "Successfully returned : " + record.Book.BookName };
  } catch (error) {
    console.log("Failed to return! ", error);
    ctx.body = { 'status': false, 'info': error };
  }
});

libraryRouter.get('/book_rent_status', async ctx => {
  console.log("Getting user rent status...");
  let data = ctx.request.body;
  try {
    const bookRepo = getConnection().getRepository(Book);
    const recordRepo = getConnection().getRepository(Record);
    let book = (await bookRepo.findByIds(data.BookNo))[0];
    let res = await recordRepo.find({
      where: { Book: book },
      relations: ["User"]
    });
    ctx.body = { 'status': true, res: res };
  } catch (error) {
    console.log("Failed to query! ", error);
    ctx.body = { 'status': false, 'info': error };
  }
});

libraryRouter.get('/user_rent_status', async ctx => {
  console.log("Getting user rent status...");
  try {
    const recordRepo = getConnection().getRepository(Record);
    let res = await recordRepo.find({
      where: { User: ctx.session.user, Returned: false },
      relations: ["Book"]
    });
    ctx.body = { 'status': true, res: res };
  } catch (error) {
    console.log("Failed to query! ", error);
    ctx.body = { 'status': false, 'info': error };
  }
});

libraryRouter.get('/top_users', async ctx => {
  console.log("Getting popular books...");
  try {
    const res = await getConnection().query("select  `user`.Name,`user`.Dept,`user`.CardId,a.Borrows \
                                          from `user`,(select userCardId, COUNT(*)as Borrows \
                                                      from `record` \
                                                      GROUP BY userCardId) as a \
                                          where (`user`.CardId = a.userCardId) \
                                          order by Borrows desc \
                                          limit 0,10");
    ctx.body = { 'status': true, 'res': res };
  } catch (error) {
    console.log("Failed to query! ", error);
    ctx.body = { 'status': false, 'info': error };
  }
})

libraryRouter.get('/top_books', async ctx => {
  console.log("Getting popular books...");
  try {
    const res = await getConnection().query("select BookNo,BookName,BookType,Author,Publisher,Price,Borrows \
                                          from `book`,(select bookBookNo, COUNT(*) as Borrows \
                                                      from `record` \
                                                      GROUP BY bookBookNo) as a \
                                          where (`book`.BookNo = a.bookBookNo) \
                                          order by Borrows desc \
                                          limit 0,10");
    ctx.body = { 'status': true, 'res': res };
  } catch (error) {
    console.log("Failed to query! ", error);
    ctx.body = { 'status': false, 'info': error };
  }
})

libraryRouter.get('/total_users', async ctx => {
  console.log("Getting total users ...");
  try {
    const res = await getConnection().getRepository(User).count();
    ctx.body = { 'status': true, 'res': res };
  } catch (error) {
    console.log("Failed to query! ", error);
    ctx.body = { 'status': false, 'info': error };
  }
})

libraryRouter.get('/total_borrows', async ctx => {
  console.log("Getting total borrows ...");
  try {
    const res = await getConnection().getRepository(Record).count();
    ctx.body = { 'status': true, 'res': res };
  } catch (error) {
    console.log("Failed to query! ", error);
    ctx.body = { 'status': false, 'info': error };
  }
})

libraryRouter.get('/total_books', async ctx => {
  console.log("Getting total books ...");
  try {
    const res = await getConnection().query("select sum(Total) as total from Book");
    ctx.body = { 'status': true, 'res': res[0].total };
  } catch (error) {
    console.log("Failed to query! ", error);
    ctx.body = { 'status': false, 'info': error };
  }
})