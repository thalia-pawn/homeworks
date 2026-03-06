import { Book } from '../dataModels/books.js';

export const books = new Map();
export const booksResources = new Map();

const demoBook = new Book({
  title: 'Node.js Design Patterns',
  description: 'Практическое руководство по созданию приложений на Node.js.',
  authors: 'Mario Casciaro, Luciano Mammino',
  favorite: 'true',
  fileCover: 'https://placehold.co/300x420?text=Book+Cover',
  fileName: 'nodejs-design-patterns.pdf',
  fileBook: 'demo-file-id',
});

books.set(demoBook.id, demoBook);
