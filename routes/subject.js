import express from 'express';
import { insertSubject, isSubject } from '../database/subjects.js';
import { getAllGroups } from '../database/groups.js';

const router = express.Router();

function isNotUndefined(subject) {
  return (subject.subjectID && subject.subjectName && subject.course
    && subject.seminar && subject.lab);
}

function isValis(subject) {
  const regex = /^[a-zA-Z ]+$/;
  return isNotUndefined(subject) && subject.subjectID.length > 0 && subject.subjectID.length < 10
    && subject.subjectName.length > 0
    && subject.course > 0 && subject.seminar > 0 && subject.lab > 0 && regex.test(subject.name);
}

router.post('/', async (request, response) => {
  response.type('.html');
  let error = '';
  try {
    if (!isValis(request.fields)) {
      error = 'Hibas adatok!';
      const years = await getAllGroups();
      response.render('subject', {
        subject: request.fields,
        error,
        years,
        username: request.session.username,
        role: request.session.role,
      });
    } else {
      const issubject = await isSubject(request.fields.subjectID);
      if (!issubject) {
        await insertSubject(request.fields, request.session.username);
        response.redirect('/');
      } else {
        error = 'A tantárgy már létezik!';
        const years = await getAllGroups();
        response.render('subject', {
          subject: request.fields,
          years,
          error,
          username: request.session.username,
          role: request.session.role,
        });
      }
    }
  } catch (err) {
    console.error(`Error: ${err}`);
    response.render('error', { error: 'Something went wrong!', status: 500 });
  }
});

router.get('/', async (request, response) => {
  try {
    const years = await getAllGroups();
    response.render('subject', {
      subject: request.fields, years, error: '', username: request.session.username, role: request.session.role,
    });
  } catch (err) {
    console.error(`Error: ${err}`);
    response.render('error', { error: 'Something went wrong!', status: 500 });
  }
});

export default router;
