import express from 'express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import eformidable from 'express-formidable';
import {
  insertStudent, deleteSubjectOfStudent, insertSubject, insertFileOfSubject, insertSubjectOfStudent,
  isStudent, createTables, isSubject, isSubjectOfStudent, isFileOfSubject, getAllSubjects,
  getSubject,
  getFilesOfSubject,
} from './database/timetable.js';

const app = express();

app.use(express.static(join(process.cwd(), 'static/')));
app.use(express.urlencoded({ extended: true }));

const uploadDir = join(process.cwd(), 'uploadDir');

if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}
app.use(eformidable({ uploadDir }));

createTables().catch((err) => {
  console.error(err);
});

app.set('view engine', 'ejs');

app.post('/submit_subject', async (request, response) => {
  const regex = /^[a-zA-Z ]+$/;
  response.type('.html');

  if (request.fields.subjectID === '' || request.fields.subjectName === '' || request.fields.course <= 0 || request.fields.seminar <= 0 || request.fields.lab <= 0 || !regex.test(request.fields.name)) {
    const error = 'Hibas bemeneti adatok!';
    response.status(400);
    response.render('subject', { subject: request.fields, error });
  } else {
    const issubject = await isSubject(request.fields);
    if (!issubject) {
      await insertSubject(request.fields);
      response.redirect('/');
    } else {
      const error = 'Hiba: Az adott tantargy mar letezik!';
      response.status(400);
      response.render('subject', { subject: request.fields, error });
    }
  }
});

async function checkConnectionType(request, response) {
  const subjectOfStudent = await isSubjectOfStudent(request.fields);
  let error = '';

  if (request.fields.connection === 'join') {
    if (!subjectOfStudent) {
      await insertSubjectOfStudent(request.fields);
      error = 'A csatlakozas sikeres volt!';
    } else {
      error = `${request.fields.studentID} mar csatlakozott a ${request.fields.subjectID} tantargyhoz!\n`;
      response.status(304);
    }
  } else if (request.fields.connection === 'unjoin') {
    if (subjectOfStudent) {
      await deleteSubjectOfStudent(request.fields);
      error = 'A kilepes sikeres volt!';
    } else {
      error = `${request.fields.studentID} nem resze a ${request.fields.subjectID} tantargynak!\n`;
      response.status(304);
    }
  } else {
    error = 'Hibas bemeneti adatok!';
    response.status(406);
  }
  return error;
}

app.post('/submit_student', async (request, response) => {
  const subject = await isSubject(request.fields);
  response.type('.html');
  let error = '';

  if (request.fields.subjectID === '' || request.fields.studentID === '' || request.fields.studentName === '') {
    error = 'Hibas bemeneti adatok!';
    response.status(406);
  } else if (!subject) {
    error = 'Hiba: Az adott tantargy nem letezik!';
    response.status(406);
  } else {
    const student = await isStudent(request.fields);
    if (!student) {
      await insertStudent(request.fields);
    }
    error = await checkConnectionType(request, response);
  }
  const subjects = await getAllSubjects();
  response.status(200);
  response.render('student', { student: request.fields, subjects, error });
});

app.post('/submit_file/:id', async (request, response) => {
  const file = request.files.myfile;
  response.type('.html');
  if (file === '') {
    response.status(406);
  } else {
    const split = file.path.split('\\');
    const len = split.length;
    const filePath = `\\${split[len - 2]}\\${split[len - 1]}`;
    await insertFileOfSubject(request.params.id, filePath);
  }
  response.redirect(`/subjects/${request.params.id}`);
});

app.post('/submit_file', async (request, response) => {
  const file = request.files.myfile;
  response.type('.html');
  let error = '';

  if (file === '' || request.fields.subjectID === '') {
    error = 'Hibas bemeneti adatok!\n';
    response.status(406);
    response.render('file', { student: request.fields, error });
  } else {
    const issubject = await isSubject(request.fields);
    if (!issubject) {
      error = 'Hiba: Az adott tantargy nem letezik!\n';
      response.status(406);
      response.render('file', { student: request.fields, error });
    } else {
      const isFile = await isFileOfSubject(request.fields, file.path);
      if (isFile) {
        error = 'Hiba: Az adott file mar letezik!\n';
        response.status(406);
        response.render('file', { student: request.fields, error });
      } else {
        const split = file.path.split('\\');
        const len = split.length;
        const filePath = `\\${split[len - 2]}\\${split[len - 1]}`;
        await insertFileOfSubject(request.fields.subjectID, filePath);
        response.redirect('/');
      }
    }
  }
});

app.get('/subject', async (request, response) => {
  response.render('subject', { subject: request.fields, error: '' });
});

app.get('/student', async (request, response) => {
  const subjects = await getAllSubjects();
  response.render('student', { student: request.fields, subjects, error: '' });
});

app.get('/file', async (request, response) => {
  response.render('file', { subject: request.fields, error: '' });
});

app.use('/subjects/:id', async (request, response) => {
  try {
    const subject = await getSubject(request.params.id);
    const files = await getFilesOfSubject(request.params.id);
    response.render('details', { subject: subject[0], files });
  } catch (err) {
    console.error(err);
    response.status(500);
    response.send('Error');
  }
});

app.use('/', async (request, response) => {
  try {
    const subjects = await getAllSubjects();
    response.render('index', { subjects });
  } catch (err) {
    console.error(err);
    response.status(500);
    response.send('Error');
  }
});

app.listen(8080, () => { console.log('Server listening on http://localhost:8080/ ...'); });
