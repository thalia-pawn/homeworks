import express from 'express'
const router = express.Router();
import { ValidationError } from "../errors/commonErrors.js";

router.post("/login", (req, res, next) => {
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

export {
    router
};