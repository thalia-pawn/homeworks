import { MulterError } from 'multer';
import { ValidationError, EntitityNotFound } from '../errors/commonErrors.js';

function isApiRequest(req) {
  return req.originalUrl.startsWith('/api/');
}

function errHandling(err, req, res, next) {
  const statusCode = err.statusCode || (err instanceof MulterError ? 400 : 500);
  const message =
    err.description ||
    (err instanceof MulterError ? 'Error during file processing' : err.message || 'Server error');

  if (isApiRequest(req)) {
    return res.status(statusCode).json({
      reason: err.reason || 'SERVER_ERROR',
      description: message,
    });
  }

  return res.status(statusCode).render('error', {
    title: 'Ошибка',
    statusCode,
    message,
  });
}

function notFound(req, res) {
  if (isApiRequest(req)) {
    return res.status(404).json({ message: '404 | страница не найдена' });
  }

  return res.status(404).render('error', {
    title: 'Страница не найдена',
    statusCode: 404,
    message: 'Страница, которую вы запросили, не найдена.',
  });
}

export { errHandling, notFound };
