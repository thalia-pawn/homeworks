import express from 'express';
import { ValidationError } from '../errors/commonErrors.js';

const router = express.Router();

router.post('/login', (req, res, next) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      throw new ValidationError('Fields login and password are required');
    }

    if (Object.values(req.body).some((value) => typeof value !== 'string')) {
      throw new ValidationError('Fields login and password must be string!');
    }

    res.status(201).json({ id: 1, mail: 'test@mail.ru' });
  } catch (error) {
    next(error);
  }
});

export { router };
