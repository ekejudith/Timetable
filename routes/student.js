import express from 'express';
import { getAllStudents, isStudent } from '../database/students.js';
import {
  insertSubjectOfStudent, isSubject,
  isSubjectOfStudent, getAllSubjects, deleteSubjectOfStudent, getSubjectsOfUser,
} from '../database/subjects.js';

const router = express.Router();

async function checkConnectionType(request, response) {
  let error = '';
  try {
    const subjectOfStudent = await isSubjectOfStudent(
      request.fields.subjectID,
      request.fields.studentID,
    );

    if (request.fields.connection === 'join') {
      if (!subjectOfStudent) {
        await insertSubjectOfStudent(request.fields);
        error = 'A csatlakozas sikeres volt!';
      } else {
        error = `${request.fields.studentID} mar csatlakozott a ${request.fields.subjectID} tantargyhoz!\n`;
      }
    } else if (request.fields.connection === 'unjoin') {
      if (subjectOfStudent) {
        await deleteSubjectOfStudent(request.fields);
        error = 'A kilepes sikeres volt!';
      } else {
        error = `${request.fields.studentID} nem resze a ${request.fields.subjectID} tantargynak!\n`;
      }
    } else {
      error = 'Hibas adatok!';
    }
  } catch (err) {
    response.render('error', { error: 'Something went wrong!', status: 500 });
  }
  return error;
}

router.post('/', async (request, response) => {
  try {
    const subject = await isSubject(request.fields.subjectID);
    response.type('.html');
    let error = '';

    if (!request.fields.subjectID || !request.fields.studentID || !request.fields.studentName) {
      error = 'Hibas adatok!';
    } else if (!subject) {
      error = 'Az adott tantargy nem letezik!';
    } else {
      const student = await isStudent(request.fields);
      if (!student) {
        error = 'Az adott diak nem letezik!';
      } else {
        error = await checkConnectionType(request, response);
      }
    }
    let subjects = '';
    if (request.session.role === 'admin') {
      subjects = await getAllSubjects();
    } else {
      subjects = await getSubjectsOfUser(request.session.username);
    }
    const students = await getAllStudents();
    response.render('student', {
      students, subjects, error, username: request.session.username, role: request.session.role,
    });
  } catch (err) {
    console.error(`Error: ${err}`);
    response.render('error', { error: 'Something went wrong!', status: 500 });
  }
});

router.get('/', async (request, response) => {
  try {
    let subjects = '';
    if (request.session.role === 'admin') {
      subjects = await getAllSubjects();
    } else {
      subjects = await getSubjectsOfUser(request.session.username);
    }
    const students = await getAllStudents();
    response.render('student', {
      students, subjects, error: '', username: request.session.username, role: request.session.role,
    });
  } catch (err) {
    console.error(`Error: ${err}`);
    response.render('error', { error: 'Something went wrong!', status: 500 });
  }
});

export default router;
