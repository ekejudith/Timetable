import express from 'express';
import path from 'path';
import { getFilesOfSubject, insertFileOfSubject } from '../database/files.js';
import { getSubject, getUserOfSubject } from '../database/subjects.js';

const router = express.Router();

router.post('/:id', async (request, response, next) => {
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
  next();
});

router.use('/:id', async (request, response) => {
  try {
    const [subject, name] = await Promise.all([getSubject(request.params.id),
      getUserOfSubject(request.params.id)]);
    if (subject !== undefined) {
      const files = await getFilesOfSubject(request.params.id);
      response.render('details', {
        subject, files, username: request.session.username, role: request.session.role, name,
      });
    } else {
      response.redirect('/');
    }
  } catch (err) {
    console.error(err);
    response.render('error', { error: 'Something went wrong!', status: 500 });
  }
});

export default router;
