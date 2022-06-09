import express from 'express';
import { getAllSubgroups } from '../database/groups.js';
import { getAllSubjects } from '../database/subjects.js';
import { getAllTeachers } from '../database/users.js';

const router = express.Router();

router.get('/', async (request, response) => {
  const years = await getAllSubgroups();
  const subjects = await getAllSubjects();
  const teachers = await getAllTeachers();
  response.render('schedule', {
    role: request.session.role,
    username: request.session.username,
    years,
    subjects,
    teachers,
  });
});

export default router;
