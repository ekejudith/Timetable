import express from 'express';
import bcrypt from 'bcrypt';
import { getUser, insertUser } from '../database/users.js';

const router = express.Router();

router.get('/', async (request, response) => {
  if (request.session.role === 'admin') {
    response.render('signup', { username: request.session.username, error: '', role: 'admin' });
  } else {
    response.redirect('/');
  }
});

router.post('/', async (request, response) => {
  if (request.fields.email && request.fields.name && request.fields.password1
    && request.fields.password2 && request.fields.password1 === request.fields.password2) {
    try {
      const isuser = await getUser(request.fields.email);
      if (isuser) {
        response.render('signup', { username: request.session.username, error: 'A felhasznalo már létezik!',  role: 'admin' });
      } else {
        const password = bcrypt.hashSync(request.fields.password1, 10);
        await insertUser(request.fields.email, request.fields.name, password, 'user');
        response.redirect('/');
      }
    } catch (err) {
      console.error(err);
      response.render('error', { error: 'Something went wrong!', status: 500 });
    }
  } else {
    response.render('signup', { username: request.session.username, error: 'Hibas adatok!', role: 'admin' });
  }
});

export default router;
