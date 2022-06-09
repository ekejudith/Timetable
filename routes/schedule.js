import express from 'express';
import { getAllSubgroups, isSubGroup } from '../database/groups.js';
import { getAllSubjects, getSubjectsOfUser, isSubject } from '../database/subjects.js';
import { deleteFromTimetable, getTimetableOfTeacher, insertIntoTimetable } from '../database/timetable.js';
import { getAllTeachers, isTeacher } from '../database/users.js';
import {
  getAllWishes, getWishesOfTeacher, insertIntoWishes, updateWishes,
} from '../database/wishes.js';

const router = express.Router();

async function exists(fields) {
  const [subject, teacher, subgroup] = await Promise.all([isSubject(fields.subject),
    isTeacher(fields.teacher), isSubGroup(fields.year)]);
  return (subject && teacher && subgroup);
}

async function isValid(fields) {
  if (fields.day && fields.hour && fields.year
        && fields.type && fields.subject && fields.teacher) {
    return exists(fields);
  }
  return false;
}

router.post('/wish', async (request, response) => {
  if (request.session.role === 'admin') {
    try {
      if (request.fields.method === 'insert') {
        await insertIntoTimetable(request.fields);
      } else {
        await deleteFromTimetable(request.fields);
      }
      await updateWishes(request.fields, 'approved');
      response.status(200);
    } catch (err) {
      response.status(400);
    }
    response.send();
  } else {
    response.redirect('/');
  }
});

router.delete('/wish', async (request, response, next) => {
  if (request.session.role === 'user') {
    try {
      await insertIntoWishes(request.fields, 'delete', 'pending');
      response.status(200);
    } catch (err) {
      response.status(400);
    }
    response.send();
  } else {
    next();
  }
});

router.delete('/wish', async (request, response) => {
  try {
    await updateWishes(request.fields, 'rejected');
    response.status(200);
  } catch (err) {
    response.status(400);
  }
  response.send();
});

router.post('/add', async (request, response, next) => {
  if (request.session.role === 'user') {
    try {
      const valid = await isValid(request.fields);
      if (valid) {
        await insertIntoWishes(request.fields, 'insert', 'pending');
        response.status(200);
      } else {
        response.status(400);
      }
    } catch (err) {
      response.status(400);
    }
    response.send();
  } else {
    next();
  }
});

router.post('/add', async (request, response) => {
  try {
    const valid = await isValid(request.fields);
    if (valid) {
      await insertIntoTimetable(request.fields);
      response.status(200);
    } else {
      response.status(400);
    }
  } catch (err) {
    response.status(400);
  }
  response.send();
});

router.get('/', async (request, response, next) => {
  try {
    if (request.session.role === 'user') {
      const [subjects, years] = await Promise.all(
        [getSubjectsOfUser(request.session.username), getAllSubgroups()],
      );
      const [lines, wishes] = await Promise.all([getTimetableOfTeacher(request.session.username),
        getWishesOfTeacher(request.session.username)]);
      const teachers = request.session.username;

      response.render('schedule', {
        role: request.session.role,
        username: request.session.username,
        years,
        subjects,
        teachers,
        lines,
        wishes,
      });
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    response.render('error', { error: 'Something went wrong!', status: 500 });
  }
});

router.get('/', async (request, response) => {
  try {
    const [subjects, teachers, years] = await Promise.all([getAllSubjects(),
      getAllTeachers(), getAllSubgroups()]);
    const wishes = await getAllWishes();

    response.render('schedule', {
      role: request.session.role,
      username: request.session.username,
      years,
      subjects,
      teachers,
      wishes,
    });
  } catch (err) {
    console.error(err);
    response.render('error', { error: 'Something went wrong!', status: 500 });
  }
});

export default router;
