import express from 'express'
const router = express.Router();
import { Book } from '../dataModels/books.js';
import  { books, booksResources } from '../repo/books.js';
import { ValidationError, EntitityNotFound } from "../errors/commonErrors.js";
import { multerData } from '../midlewares/file.js';
import path from "path";
import { v4 as uuidv4 } from 'uuid';

router.post("/", (req, res, next) => {
    try {
        const {title, description, authors, favorite, fileCover, fileName, fileBook} = req.body;
        if (Object.values(req.body).filter((v) => typeof v != "string").length > 0) throw new ValidationError("Fields must be string!");
        if (!title || !description || !authors || !favorite || !fileCover || !fileName || !fileBook) throw new ValidationError("Fields title, description, authors, favorite, fileCover, fileName, fileBook are required");
        if (!booksResources.has(fileBook)) throw new ValidationError("Filebook with such uuid is not found. Please upload the file.")
        const book = new Book(req.body);
        books.set(book.id, book);
        res.json(book);
    } catch (error) {
        next(error);
    }
});

router.put("/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        if (Object.values(req.body).filter((v) => typeof v != "string").length > 0) throw new ValidationError("Fields must be string!");
        if (!books.has(id)) {
            throw new EntitityNotFound(`Book with id: ${id} not found`)
        }
        const data = books.get(id);
        const newData = Object.assign(data, req.body)
        books.set(id, newData);
        res.json(newData);
    } catch (error) {
        res.status(error.statusCode);
        res.json(error);
        next(error);
    }
});

router.post('/upload', 
    multerData.single('book'),
    (req, res, next) => {
        try {
            if (!req.file) throw new ValidationError("File is required")
            const { filename } = req.file
            const fileUuid = uuidv4()
            booksResources.set(fileUuid,  path.join("public/books/", filename))
            res.json({fileUuid})
        } catch (error) {
            next(error)
        }
});

router.delete("/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        if (!books.has(id)) {
            throw new EntitityNotFound(`Book with id: ${id} not found`)
        }
        books.delete(id);
        res.json({result: 'ok'})
    } catch (error) {
        next(error);
    }
});

router.get("/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        if (!books.has(id)) {
            throw new EntitityNotFound(`Book with id: ${id} not found`)
        }
        res.json({...books.get(id)})
    } catch (error) {
        next(error);
    }
});

router.get("/:id/download", (req, res, next) => {
    try {
        const { id } = req.params;
        if (!books.has(id)) {
            throw new EntitityNotFound(`Book with id: ${id} not found`)
        }
        const bookData = books.get(id);
        res.download(booksResources.get(bookData.fileBook), (err)=> {
            if (err) {
                res.status(404);
                res.json("Book is not found");
            }
        })
    } catch (error) {
        next(error);
    }
});

router.get("/", (req, res, next) => {
    try {
        res.json([...books.values()])
    } catch (error) {
        next(error);
    }
});

export {
    router
}