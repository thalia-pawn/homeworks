import express from 'express';
import path from 'path';
import session from 'express-session';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import http from 'http';

import { router as booksRouter } from './routes/books.js';
import { router as usersRouter } from './routes/users.js';
import { errHandling, notFound } from './midlewares/errors.js';
import { MONGODB_URI, PORT } from './utils/config.js';
import passport from './midlewares/passport.js';
import { initCommentsSocket } from './events/comments.js';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.redirect('/books');
});

initCommentsSocket(server);
app.use('/books', booksRouter);
app.use('/user', usersRouter);

app.use(notFound);
app.use(errHandling);

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, {
      pass: 'password',
      user: 'root',
    });

    server.listen(PORT, () => {
      console.log(`Сервер запущен на порту: ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

main();