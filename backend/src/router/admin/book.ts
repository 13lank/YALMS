import { Book } from "../../entity/Book";
import { getConnection } from "typeorm";

const Router = require('koa-router');
export const bookRouter = new Router();
bookRouter.post('/addbooks', async (ctx) => {
  const data = ctx.request.body;
  console.log("Adding books to the library:", data);
  try {
    for (var item of data) {
      let book = new Book();
      for (var keys in item) book[keys] = item[keys];
      book.Storage = item['Total'];
      book.Records = [];
      await getConnection().manager.save(book);
    }
    ctx.body = { 'status': true, 'info': data.length + "Books Added!" };
    console.log(data.length + "Books Added!");
  }
  catch (err) {
    console.log("Failed to add book:", err);
    ctx.body = { 'status': false, 'info': err };
  }
});

bookRouter.post('/delete', async (ctx) => {
  let BookNo = ctx.request.body.BookNo;
  console.log("Deleting book, BookNo: ", BookNo);
  try {
    let bookRepository = getConnection().getRepository(Book);
    const target_book = await bookRepository.findOne({ BookNo: BookNo });
    bookRepository.remove(target_book);
    console.log("Deleted book: ", target_book.BookName);
    ctx.body = { 'status': true, 'info': target_book };
  }
  catch (err) {
    console.log("Deletion Failed! ", err);
    ctx.body = { 'status': false, 'info': err };
  }
});


bookRouter.post('/')