import { MulterError } from "multer";
import { ValidationError, EntitityNotFound } from "../errors/commonErrors.js";

async function errHandling (err, req, res, next) {
    try {
        if (err instanceof ValidationError || err instanceof EntitityNotFound) {
            res.status(err.statusCode);
            res.json(err);
        } else if (err instanceof MulterError) {
            res.status(400);
            res.json({
                serverError: "Error during file processing"
            });
        } else {
            res.status(500);
            res.json({
                serverError: err.message
            });
        }
    } catch (error) {
        next(error)
    }
}

async function notFound(req, res) {
    res.status(404)
    res.json('404 | страница не найдена')
}

export {
    errHandling,
    notFound
}