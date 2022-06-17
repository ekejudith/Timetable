import express from 'express';
import {
  isSubject,
  getAllSubjects,
  updateUserOfSubject,
} from '../database/subjects.js';
import { getAllTeachers, isTeacher } from '../database/users.js';

const router = express.Router();

router.post('/', async (request, response) => {
  try {
    if (request.fields.teacherID && request.fields.subjectID) {
      const [subject, teacher] = await Promise.all([isSubject(request.fields.subjectID),
        isTeacher(request.fields.teacherID)]);
      if (subject && teacher) {
        await updateUserOfSubject(request.fields.subjectID, request.fields.teacherID);
        response.redirect('/');
      } else {
        const [subjects, teachers] = await Promise.all([getAllSubjects(), getAllTeachers()]);
        response.render('teachers', {
          username: request.session.username,
          role: request.session.role,
          subjects,
          teachers,
          error: 'Hibás adatok!',
        });
      }
    } else {
      const [subjects, teachers] = await Promise.all([getAllSubjects(), getAllTeachers()]);
      response.render('teachers', {
        username: request.session.username,
        role: request.session.role,
        subjects,
        teachers,
        error: 'Hibás adatok!',
      });
    }
  } catch (err) {
    console.error(`Error: ${err}`);
    response.render('error', { error: 'Something went wrong!', status: 500 });
  }
});

router.get('/', async (request, response) => {
  try {
    const [subjects, teachers] = await Promise.all([getAllSubjects(), getAllTeachers()]);
    response.render('teachers', {
      username: request.session.username,
      role: request.session.role,
      subjects,
      teachers,
      error: '',
    });
  } catch (err) {
    console.error(`Error: ${err}`);
    response.render('error', { error: 'Something went wrong!', status: 500 });
  }
});

export default router;
