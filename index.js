import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import eformidable from 'express-formidable';
import { getAllSubjects } from './database/subjects.js';
import fileRouter from './routes/file.js';
import studentRouter from './routes/student.js';
import subjectRouter from './routes/subject.js';
import apiRouter from './api/router.js';
import { getPassword, getRole, insertUser } from './database/user.js';

const app = express();

app.use(express.static(join(process.cwd(), 'static/')));
app.use(express.urlencoded({ extended: true }));

const uploadDir = join(process.cwd(), 'static/uploadDir');

if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

app.use(eformidable({ uploadDir }));

app.use(session({
  secret: '142e6ecf4288sasa4f03',
  resave: false,
  saveUninitialized: true,
}));

app.set('view engine', 'ejs');

app.get('/login', async (request, response) => {
  response.render('login');
});

app.post('/login', async (request, response) => {
  if (request.fields.email && request.fields.password) {
    try {
      const password = await getPassword(request.fields.email);
      console.log(password);
      if (password) {
        const valid = await bcrypt.compare(request.fields.password, password);
        if (valid) {
          const role = await getRole(request.fields.email);
          request.session.username = request.fields.email;
          request.session.role = role;
          response.redirect('/');
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

app.post('/logout', (requset, response) => {
  requset.session.destroy((err) => {
    if (err) {
      response.status(400);
    } else {
      response.status(200);
    }
    response.send();
  });
});

app.post('/signup', async (request, response) => {
  if (request.fields.email && request.fields.password) {
    try {
      const password = bcrypt.hashSync(request.fields.password, 10);
      await insertUser(request.fields.email, password, 'user');
    } catch (err) {
      console.error(err);
      response.render('error', { error: 'Something went wrong!', status: 500 });
    }
  }
});

app.use((request, response, next) => {
  if (request.session.username) {
    next();
  } else {
    response.redirect('/login');
  }
});

app.use('/api', apiRouter);
app.use('/file', fileRouter);
app.use('/student', studentRouter);
app.use('/subject', subjectRouter);

app.use('/*', async (request, response) => {
  try {
    const subjects = await getAllSubjects();
    response.render('index', { subjects, username: request.session.username });
  } catch (err) {
    console.error(err);
    response.render('error', { error: 'Something went wrong!', status: 500 });
  }
});

app.listen(8080, () => { console.log('Server listening on http://localhost:8080/ ...'); });
