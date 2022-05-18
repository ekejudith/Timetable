import express from 'express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import eformidable from 'express-formidable';
import { getAllSubjects } from './database/subjects.js';
import fileRouter from './routes/file.js';
import studentRouter from './routes/student.js';
import subjectRouter from './routes/subject.js';
import apiRouter from './api/router.js';

const app = express();

app.use(express.static(join(process.cwd(), 'static/')));
app.use(express.urlencoded({ extended: true }));

const uploadDir = join(process.cwd(), 'static/uploadDir');

if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

app.use(eformidable({ uploadDir }));

app.set('view engine', 'ejs');

app.use('/api', apiRouter);
app.use('/file', fileRouter);
app.use('/student', studentRouter);
app.use('/subject', subjectRouter);

app.use('/', async (request, response) => {
  try {
    const subjects = await getAllSubjects();
    response.render('index', { subjects });
  } catch (err) {
    console.error(err);
    response.render('error', { error: 'Something went wrong!', status: 500 });
  }
});

app.listen(8080, () => { console.log('Server listening on http://localhost:8080/ ...'); });
