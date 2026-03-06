import { v4 as uuidv4 } from 'uuid';

export class Book {
  constructor({ title, description, authors, favorite, fileCover, fileName, fileBook }) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.fileBook = fileBook;
  }
}
