import express from 'express';
import path from 'path';
import { insertFileOfSubject } from '../database/files.js';
import { isSubject } from '../database/subjects.js';

const router = express.Router();

router.post('/submit/:id', async (request, response) => {
  const file = request.files.myfile;
  response.type('.html');
  if (file === '') {
    response.status(406);
  } else {
    const dirname = path.basename(path.dirname(file.path));
    const filename = path.basename(file.path);
    const filePath = path.join(dirname, filename);
    try {
      await insertFileOfSubject(request.params.id, filePath, file.name);
    } catch (err) {
      console.error(`Error: ${err}`);
      response.render('error', { error: 'Something went wrong!', status: 500 });
    }
  }
  response.redirect(`/subject/${request.params.id}`);
});

router.post('/submit', async (request, response) => {
  const file = request.files.myfile;
  response.type('.html');
  let error = '';

  if (file === '' || request.fields.subjectID === '') {
    error = 'Hibas bemeneti adatok!\n';
    response.status(406);
    response.render('file', { student: request.fields, error });
  } else {
    try {
      const issubject = await isSubject(request.fields);
      if (!issubject) {
        error = 'Hiba: Az adott tantargy nem letezik!\n';
        response.status(406);
        response.render('file', { student: request.fields, error });
      } else {
        const dirname = path.basename(path.dirname(file.path));
        const filename = path.basename(file.path);
        const filePath = path.join(dirname, filename);
        await insertFileOfSubject(request.fields.subjectID, filePath, file.name);
        response.redirect('/');
      }
    } catch (err) {
      console.error(`Error: ${err}`);
      response.render('error', { error: 'Something went wrong!', status: 500 });
    }
  }
});

router.get('/', async (request, response) => {
  response.render('file', { subject: request.fields, error: '' });
});

export default router;
