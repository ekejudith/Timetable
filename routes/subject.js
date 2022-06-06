import express from 'express';
import {
  insertSubject, isSubject, getSubject,
} from '../database/subjects.js';
import { getFilesOfSubject } from '../database/files.js';

const router = express.Router();

function checkInputs(subject) {
  const regex = /^[a-zA-Z ]+$/;
  return !(subject.subjectID === undefined || subject.subjectID === '' || subject.subjectName === '' || subject.course <= 0 || subject.seminar <= 0 || subject.lab <= 0 || !regex.test(subject.name));
}

router.post('/submit', async (request, response) => {
  response.type('.html');

  if (!checkInputs(request.fields)) {
    const error = 'Hibas bemeneti adatok!';
    response.status(400);
    response.render('subject', { subject: request.fields, error, username: request.session.username });
  } else {
    try {
      const issubject = await isSubject(request.fields);
      if (!issubject) {
        await insertSubject(request.fields, request.session.username);
        response.redirect('/');
      } else {
        const error = 'Hiba: Az adott tantargy mar letezik!';
        response.status(400);
        response.render('subject', { subject: request.fields, error, username: request.session.username });
      }
    } catch (err) {
      console.error(`Error: ${err}`);
      response.render('error', { error: 'Something went wrong!', status: 500 });
    }
  }
});

router.get('/:id', async (request, response) => {
  try {
    const subject = await getSubject(request.params.id);
    if (subject !== undefined) {
      const files = await getFilesOfSubject(request.params.id);
      response.render('details', {
        subject, files, username: request.session.username, role: request.session.role,
      });
    } else {
      response.redirect('/');
    }
  } catch (err) {
    console.error(err);
    response.render('error', { error: 'Something went wrong!', status: 500 });
  }
});

router.get('', async (request, response) => {
  response.render('subject', { subject: request.fields, error: '', username: request.session.username });
});

export default router;
