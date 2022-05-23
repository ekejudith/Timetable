import express from 'express';
import { deleteFileOfSubject, getFilesOfSubject } from '../database/files.js';

const router = express.Router();

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
