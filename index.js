import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import eformidable from 'express-formidable';
import { getAllSubjects } from './database/subjects.js';
import detailRouter from './routes/details.js';
import studentRouter from './routes/student.js';
import subjectRouter from './routes/subject.js';
import apiRouter from './api/router.js';
import signupRouter from './routes/signup.js';
import timetableRouter from './routes/timetable.js';
import {
  getAllTeachers,
  getPassword, getRole,
} from './database/user.js';
import { checkRole, isAdmin } from './auth/middleware.js';
import { getAllGroups, getAllSubgroups } from './database/groups.js';

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

app.get('/login', async (request, response, next) => {
  if (request.session.username) {
    next();
  } else {
    response.render('login');
  }
});

app.post('/login', async (request, response) => {
  if (request.fields.email && request.fields.password) {
    try {
      const password = await getPassword(request.fields.email);
      if (password) {
        const valid = await bcrypt.compare(request.fields.password, password);
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
    request.session.role = 'guest';
    next();
  }
});

app.use('/api', apiRouter);
app.use('/details', detailRouter);

app.use('/signup', isAdmin);
app.use('/signup', signupRouter);

app.use(['/student', '/subject', '/timetable'], checkRole);
app.use('/student', studentRouter);
app.use('/subject', subjectRouter);
app.use('/timetable', timetableRouter);

app.use('/*', async (request, response) => {
  try {
    const [subjects, teachers, groups, subgroups] = await Promise.all([getAllSubjects(),
      getAllTeachers(), getAllGroups(), getAllSubgroups()]);

    response.render('index', {
      subjects,
      teachers,
      groups,
      subgroups,
      username: request.session.username,
      role: request.session.role,
    });
  } catch (err) {
    console.error(err);
    response.render('error', { error: 'Something went wrong!', status: 500 });
  }
});

app.listen(8080, () => { console.log('Server listening on http://localhost:8080/ ...'); });
