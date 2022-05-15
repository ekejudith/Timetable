import express from 'express';
import { getAllStudents, isStudent } from '../database/students.js';
import {
  insertSubjectOfStudent, isSubject, isSubjectOfStudent, getAllSubjects, deleteSubjectOfStudent,
} from '../database/subjects.js';

const router = express.Router();

async function checkConnectionType(request, response) {
  let error = '';
  try {
    const subjectOfStudent = await isSubjectOfStudent(request.fields);

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
      response.status(400);
    }
    return error;
  } catch (err) {
    response.render('error', { error: 'Something went wrong!', status: 500 });
  }
  return error;
}

router.post('/submit', async (request, response) => {
  try {
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
        error = 'Hiba: Az adott diak nem letezik!';
      } else {
        error = await checkConnectionType(request, response);
      }
    }
    const subjects = await getAllSubjects();
    const students = await getAllStudents();
    response.status(200);
    response.render('student', { students, subjects, error });
  } catch (err) {
    console.error(`Error: ${err}`);
    response.render('error', { error: 'Something went wrong!', status: 500 });
  }
});

router.get('', async (request, response) => {
  try {
    const subjects = await getAllSubjects();
    const students = await getAllStudents();
    response.render('student', { students, subjects, error: '' });
  } catch (err) {
    console.error(`Error: ${err}`);
    response.render('error', { error: 'Something went wrong!', status: 500 });
  }
});

export default router;
