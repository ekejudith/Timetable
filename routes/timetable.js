import express from 'express';
import {
  getAllGroups, getAllSubgroups, isGroup, isSubGroup,
} from '../database/groups.js';
import { getAllSubjects, isSubject } from '../database/subjects.js';
import {
  getTimetableOfGroup, getTimetableOfSubgroup, getTimetableOfSubject, getTimetableOfTeacher,
} from '../database/timetable.js';
import { getAllTeachers, isTeacher } from '../database/user.js';

const router = express.Router();

router.get('/subject/:id', async (request, response) => {
  const issubject = await isSubject(request.params.id);
  console.log(issubject);

  if (issubject) {
    const lines = await getTimetableOfSubject(request.params.id);

    const [subjects, teachers, groups, subgroups] = await Promise.all([getAllSubjects(),
      getAllTeachers(), getAllGroups(), getAllSubgroups()]);

    response.render('timetable', {
      role: request.session.role,
      type: 'Tantargy',
      name: request.params.id,
      lines,
      subjects,
      teachers,
      groups,
      subgroups,
    });
  } else {
    response.redirect('/');
  }
});

router.get('/group/:id', async (request, response) => {
  const isgroup = await isGroup(request.params.id);
  if (isgroup) {
    const lines = await getTimetableOfGroup(request.params.id);

    const [subjects, teachers, groups, subgroups] = await Promise.all([getAllSubjects(),
      getAllTeachers(), getAllGroups(), getAllSubgroups()]);

    response.render('timetable', {
      role: request.session.role,
      type: 'Csoport',
      name: request.params.id,
      lines,
      subjects,
      teachers,
      groups,
      subgroups,
    });
  } else {
    response.redirect('/');
  }
});

router.get('/subgroup/:id', async (request, response) => {
  const issubgroup = await isSubGroup(request.params.id);

  if (issubgroup) {
    const lines = await getTimetableOfSubgroup(request.params.id);

    const [subjects, teachers, groups, subgroups] = await Promise.all([getAllSubjects(),
      getAllTeachers(), getAllGroups(), getAllSubgroups()]);

    response.render('timetable', {
      role: request.session.role,
      type: 'Alcsoport',
      name: request.params.id,
      lines,
      subjects,
      teachers,
      groups,
      subgroups,
    });
  } else {
    response.redirect('/');
  }
});

router.get('/teacher/:id', async (request, response) => {
  const isteacher = await isTeacher(request.params.id);
  if (isteacher) {
    const lines = await getTimetableOfTeacher(request.params.id);

    const [subjects, teachers, groups, subgroups] = await Promise.all([getAllSubjects(),
      getAllTeachers(), getAllGroups(), getAllSubgroups()]);

    response.render('timetable', {
      role: request.session.role,
      type: 'Tanár',
      name: request.params.id,
      lines,
      subjects,
      teachers,
      groups,
      subgroups,
    });
  } else {
    response.redirect('/');
  }
});

export default router;
