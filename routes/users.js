import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import User from '../dataModels/users.js';
import { AuthError, ValidationError } from '../errors/commonErrors.js';

const router = express.Router();

const normalizeUser = (user) => ({
  id: user._id,
  login: user.login,
  email: user.email,
});

// Текущий пользователь
router.get('/me', (req, res, next) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        res.redirect('/user/login')
    } else {
      res.render('userProfile',{
        user: normalizeUser(req.user),
        title: "Информация профиля"
      });
    }
  } catch (error) {
    next(error)
  }

});

router.get('/login', (req, res, next) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
          res.render('login', {
          title: 'Страница авторизации'
        })
    } else {
      res.redirect(`/books/`);
    }
  } catch (error) {
    next(error)
  }
});

// Логин
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        status: 'ERROR',
        message: info?.message || 'Login or password is incorrect',
      });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      res.redirect('/user/me')
    });
  })(req, res, next);
});

// Логаут
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return next(sessionErr);
      }

      res.clearCookie('connect.sid');

      res.redirect('/user/login')
    });
  });
});


router.get('/signup', (req, res, next) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        res.render('signup', {
        title: "Страница регистрации"
        });
    } else {
      res.redirect('/user/me')
    }
  } catch (error) {
    next(error)
  }
});

// Регистрация
router.post('/signup', async (req, res, next) => {
  try {
      const { login, password, email } = req.body;
    if (!login || !password || !email) {
      throw new ValidationError('Please fill in all fields')
    }

    if (typeof login !== 'string' || typeof password !== 'string' || typeof email !== 'string') {
      throw new ValidationError('Invalid input')
    }
    const normalizedLogin = login.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({
      $or: [{ login: normalizedLogin }, { email: normalizedEmail }],
    });

    if (existingUser) {
      if (existingUser.login === login) {
        throw new ValidationError('Login already exists')
      }

      if (existingUser.email === email) {
        throw new ValidationError('Email already exists')
      }
    }
    const newUser = new User({
      login: normalizedLogin,
      password,
      email: normalizedEmail,
    });

    await newUser.save();

    res.redirect('/user/me')
  } catch (err) {
      next(err)
  }
});

export { router };