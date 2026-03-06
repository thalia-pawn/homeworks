import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { router as booksRouter } from './routes/books.js';
import { router as usersRouter } from './routes/users.js';
import { errHandling, notFound } from './midlewares/errors.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/books');
});

app.use('/books', booksRouter);
app.use('/api/users', usersRouter);

app.use(notFound);
app.use(errHandling);

app.listen(3000, 'localhost', () => {
  console.log('Сервер запущен: http://localhost:3000');
});
