import bcrypt from 'bcrypt';
import express from 'express';
import {
  getPassword, getRole, isUser,
} from '../database/users.js';

const router = express.Router();

router.get('/', async (request, response, next) => {
  if (request.session.username) {
    next();
  } else {
    response.render('login');
  }
});

router.post('/', async (request, response) => {
  if (request.fields.email && request.fields.password) {
    try {
      const user = await isUser(request.fields.email);
      if (user) {
        const password = await getPassword(request.fields.email);
        if (password) {
          const valid = bcrypt.compare(request.fields.password, password);
          if (valid) {
            const role = await getRole(request.fields.email);
            request.session.username = request.fields.email;
            request.session.role = role;
            response.redirect('/');
          } else {
            response.redirect('/login');
          }
        } else {
          response.redirect('/login');
        }
      } else {
        response.redirect('/login');
      }
    } catch (err) {
      console.error(err);
      response.render('error', { error: 'Something went wrong!', status: 500 });
    }
  }
});

export default router;
