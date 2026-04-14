import express from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Book from '../dataModels/books.js';
import { booksResources, getBookById, getBooks, createBook, incrViewsCount, deleteBook, isExist, updateBook } from '../repo/books.js';
import { ValidationError, EntitityNotFound, AuthError } from '../errors/commonErrors.js';
import { multerData } from '../midlewares/file.js';
import axios from 'axios';
import { getBookComments, addComment } from '../repo/comments.js';
import comments from '../dataModels/comments.js';
import { getCommentsIO } from '../events/comments.js';

const router = express.Router();

function normalizeBookPayload(payload) {
  return {
    title: payload.title?.trim() || null,
    description: payload.description?.trim() || null,
    authors: payload.authors?.trim() || null,
    favorite: payload.favorite?.trim() || false,
    fileCover: payload.fileCover?.trim() || null,
    fileName: payload.fileName?.trim() || null,
    fileBook: payload.fileBook?.trim() || null
  };
}

function validateBookPayload(payload) {
  if (Object.values(payload).some((value) => typeof value !== 'string')) {
    throw new ValidationError('Все поля книги должны быть строками.');
  }

  const requiredFields = ['title', 'description', 'authors', 'favorite', 'fileCover', 'fileName', 'fileBook'];
  const emptyField = requiredFields.find((field) => !payload[field]);

  if (emptyField) {
    throw new ValidationError(
      'Поля title, description, authors, favorite, fileCover, fileName, fileBook обязательны для заполнения.'
    );
  }
}

async function getBookOrThrow(id) {
  const isExistBook = await isExist(id)
  if (!isExistBook){
      throw new EntitityNotFound(`Book with id: ${id} not found`);
  } else {
      return await getBookById(id)
  }
}

router.get('/', async (req, res) => {
  const books = await getBooks()
  res.render('index', {
    title: 'Список книг',
    books: [...books],
  });
});

router.get('/create', (req, res, next) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      res.redirect('/user/login')
    } else {
        res.render('create', {
          title: 'Создание книги',
          book: normalizeBookPayload({}),
        })
    }
  } catch (error) {
    next(error)
  }
});

router.post('/create', async (req, res, next) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      res.redirect('/user/login')
    }
    const payload = normalizeBookPayload(req.body);
    validateBookPayload(payload);

    const book = new Book(payload);
    await createBook(book);

    res.redirect(`/books/${book.id}`);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await getBookOrThrow(id);
    const comments = await getBookComments(id)
    await axios.post(`http://viewsService:3001/counter/${id}/incr`, {});
    const response = await axios.get(`http://viewsService:3001/counter/${id}`);
    await incrViewsCount(id, response.data);

    res.render('view', {
      title: `Книга: ${book.title}`,
      book,
      comments
    });
  } catch (error) {
    next(error);
  }
});
router.post('/:id/comments/add', async (req, res, next) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.redirect('/user/login');
    }

    const { id } = req.params;
    const text = req.body.text?.trim();

    if (!text) {
      return res.redirect(`/books/${id}`);
    }

    const comment = new comments({
      bookId: id,
      text,
      login: req.user.login,
    });

    const savedComment = await addComment(comment);

    const io = getCommentsIO();

    io.to(id).emit('new_comment', {
      login: savedComment?.login ?? comment.login,
      text: savedComment?.text ?? comment.text,
      bookId: id,
    });

    return res.redirect(`/books/${id}`);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/update', async (req, res, next) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      res.redirect('/user/login')
    }
    const book = await getBookOrThrow(req.params.id);

    res.render('update', {
      title: `Редактирование: ${book.title}`,
      book,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/update', async (req, res, next) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      throw new AuthError('Please login')
    }
    const { id } = req.params;
    await getBookOrThrow(id);
    const payload = normalizeBookPayload(req.body);
    await updateBook(id, payload);
    res.redirect(`/books/${id}`);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/delete', async (req, res, next) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      throw new AuthError('Please login')
    }
    const id = req.params.id
    await deleteBook(id);
    res.redirect('/books');
  } catch (error) {
    next(error);
  }
});

router.post('/upload', multerData.single('book'), (req, res, next) => {
  try {
    if (!req.file) {
      throw new ValidationError('File is required');
    }

    const { filename } = req.file;
    const fileUuid = uuidv4();
    booksResources.set(fileUuid, path.join('public/books/', filename));

    res.json({ fileBook: fileUuid });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/download', (req, res, next) => {
  try {
    const bookData = getBookOrThrow(req.params.id);

    if (!booksResources.has(bookData.fileBook)) {
      throw new EntitityNotFound('Book file is not found');
    }

    res.download(booksResources.get(bookData.fileBook), (err) => {
      if (err) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
});

export { router };
