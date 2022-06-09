import express from 'express';
import { deleteFileOfSubject, getFilesOfSubject } from '../database/files.js';

const router = express.Router();

router.post('/logout', (request, response) => {
  request.session.destroy((err) => {
    if (err) {
      response.status(500);
    } else {
      response.status(200);
    }
    response.send();
  });
});

router.delete('/subject/:id', async (request, response) => {
  try {
    await deleteFileOfSubject(request.params.id);
    response.status(200);
    response.send();
  } catch (err) {
    response.render('error', { error: err, status: 500 });
  }
});

router.get('/:id', async (request, response) => {
  try {
    const files = await getFilesOfSubject(request.params.id);
    response.send(JSON.stringify(files));
  } catch (err) {
    response.render('error', { error: err, status: 500 });
  }
});

export default router;
