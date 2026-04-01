import Book from '../dataModels/books.js';

export const books = new Map();
export const booksResources = new Map();

async function getBooks(){
  return await Book.find({});
}

async function getBookById(id) {
  return await Book.findById({_id: id});
}

async function deleteBook(id) {
  return await Book.deleteOne({
    _id: id
  })
}
async function isExist(id) {
  return await Book.exists({
    _id: id
  })
}
async function incrViewsCount(id, countOfViews) {
  return await Book.updateOne({_id: id}, {
    countOfViews: countOfViews
  })
}

async function createBook(payload) {
  return await Book.insertOne(payload)
}

async function updateBook(id, dataToUpdate) {
  return await Book.updateOne({_id: id}, dataToUpdate)
}

export {
  getBooks,
  getBookById,
  deleteBook,
  createBook,
  incrViewsCount,
  isExist,
  updateBook
}