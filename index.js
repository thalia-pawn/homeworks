import express from 'express'
const app = express();

import {router as booksRouter} from './routes/books.js';
import {router as usersRouter} from './routes/users.js';
import { errHandling, notFound } from './midlewares/errors.js';

app.use(express.json());

app.use("/api/books/", booksRouter);
app.use("/api/users/", usersRouter);

app.use(errHandling);
app.use(notFound);

app.listen(3000, "localhost", ()=>{
    console.log("Сервер запущен.")
})