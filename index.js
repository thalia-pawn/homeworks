import express from 'express'
const app = express();
import { v4 as uuidv4 } from 'uuid';

app.use(express.json());

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.reason = "INVALID_INPUT";
        this.description = message;
        this.statusCode = 400;
    }
}

class EntitityNotFound extends Error {
    constructor(message) {
        super(message);
        this.reason = "NOT_FOUND";
        this.description = message;
        this.statusCode = 404;
    }
}

class Book {
    constructor({title, description, authors, favorite, fileCover, fileName}) {
        this.id = uuidv4();
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
    }
}

const books = new Map();

app.post("/api/user/login", (req, res, next) => {
    try {
        const {login, password} = req.body;
        if (!login || !password) throw new ValidationError("Fields login and password are required");
        if (Object.values(req.body).filter((v) => typeof v != "string").length > 0) throw new ValidationError("Fields login and password must be string!");
        res.status(201);
        res.json({
            id: 1, 
            mail: "test@mail.ru"
        });
    } catch (error) {
        res.status(error.statusCode);
        res.json(error);
        next(error);
    }
});
app.post("/api/books", (req, res, next) => {
    try {
        const {title, description, authors, favorite, fileCover, fileName} = req.body;
        if (Object.values(req.body).filter((v) => typeof v != "string").length > 0) throw new ValidationError("Fields must be string!");
        if (!title || !description || !authors || !favorite || !fileCover || !fileName) throw new ValidationError("Fields title, description, authors, favorite, fileCover, fileName are required");
        const book = new Book(req.body);
        books.set(book.id, book);
        res.json(book);
    } catch (error) {
        res.status(error.statusCode);
        res.json(error);
        next(error);
    }
});

app.put("/api/books/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        if (Object.values(req.body).filter((v) => typeof v != "string").length > 0) throw new ValidationError("Fields must be string!");
        if (!books.has(id)) {
            throw new EntitityNotFound(`Book with id: ${id} not found`)
        }
        books.set(id, {...req.body, id});
        res.json({...books.get(id)});
    } catch (error) {
        res.status(error.statusCode);
        res.json(error);
        next(error);
    }
});

app.delete("/api/books/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        if (!books.has(id)) {
            throw new EntitityNotFound(`Book with id: ${id} not found`)
        }
        books.delete(id);
        res.json({result: 'ok'})
    } catch (error) {
        res.status(error.statusCode);
        res.json(error);
        next(error);
    }
});

app.get("/api/books/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        if (!books.has(id)) {
            throw new EntitityNotFound(`Book with id: ${id} not found`)
        }
        res.json({...books.get(id)})
    } catch (error) {
        res.status(error.statusCode);
        res.json(error);
        next(error);
    }
});

app.get("/api/books/", (req, res, next) => {
    try {
        res.json([...books.values()])
    } catch (error) {
        res.status(error.statusCode);
        res.json(error);
        next(error);
    }
});

app.listen(3000, "localhost", ()=>{
    console.log("Сервер запущен.")
})