import express from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { Book } from '../dataModels/books.js';
import { books, booksResources } from '../repo/books.js';
import { ValidationError, EntitityNotFound } from '../errors/commonErrors.js';
import { multerData } from '../midlewares/file.js';
import axios from 'axios';

const router = express.Router();

function normalizeBookPayload(payload) {
  return {
    title: payload.title?.trim() || '',
    description: payload.description?.trim() || '',
    authors: payload.authors?.trim() || '',
    favorite: payload.favorite?.trim() || 'false',
    fileCover: payload.fileCover?.trim() || '',
    fileName: payload.fileName?.trim() || '',
    fileBook: payload.fileBook?.trim() || ''
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

function getBookOrThrow(id) {
  if (!books.has(id)) {
    throw new EntitityNotFound(`Book with id: ${id} not found`);
  }
  return books.get(id);
}

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Список книг',
    books: [...books.values()],
  });
});

router.get('/create', (req, res) => {
  res.render('create', {
    title: 'Создание книги',
    book: normalizeBookPayload({}),
  });
});

router.post('/create', (req, res, next) => {
  try {
    const payload = normalizeBookPayload(req.body);
    validateBookPayload(payload);

    const book = new Book(payload);
    books.set(book.id, book);

    res.redirect(`/books/${book.id}`);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const book = getBookOrThrow(req.params.id);
    axios.post(`http://viewsService:3001/counter/${req.params.id}/incr`, {}).then(()=>{
      axios.get(`http://viewsService:3001/counter/${req.params.id}`).then((body)=>{
          book.countOfViews = JSON.stringify(body.data);
          books.set(req.params.id, book);
      }).then(()=>{
        res.render('view', {
          title: `Книга: ${book.title}`,
          book,
        });
      })
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/update', (req, res, next) => {
  try {
    const book = getBookOrThrow(req.params.id);

    res.render('update', {
      title: `Редактирование: ${book.title}`,
      book,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/update', (req, res, next) => {
  try {
    const { id } = req.params;
    const currentBook = getBookOrThrow(id);
    const payload = normalizeBookPayload(req.body);
    validateBookPayload(payload);

    const updatedBook = Object.assign(currentBook, payload);
    books.set(id, updatedBook);

    res.redirect(`/books/${id}`);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/delete', (req, res, next) => {
  try {
    getBookOrThrow(req.params.id);
    books.delete(req.params.id);
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
