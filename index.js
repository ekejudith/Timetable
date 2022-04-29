import express from 'express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import eformidable from 'express-formidable';

const app = express();

app.use(express.static(join(process.cwd(), 'static')));
app.use(express.urlencoded({ extended: true }));

const uploadDir = join(process.cwd(), 'uploadDir');

if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}
app.use(eformidable({ uploadDir }));

const students = {};
const subjects = {};
const files = {};

app.post('/submit_form_tantargyak', (request, response) => {
  const regex = /^[a-zA-Z ]+$/;
  if (request.fields.code === '' || request.fields.name === '' || request.fields.course <= 0 || request.fields.seminar <= 0 || request.fields.lab <= 0 || !regex.test(request.fields.name)) {
    const respBody = `Hibas bemeneti adatok!
        `;
    console.log(respBody);
    response.set('Content-Type', 'text/plain;charset=utf-8');
    response.writeHead(406);
    response.end(respBody);
  } else {
    const subjectID = request.fields.code;
    if (!(subjectID in subjects)) {
      subjects[subjectID] = true;

      const respBody = `A szerver sikeresen megkapta a következő információt:
        Egyedi kod: ${request.fields.code}
        Nev: ${request.fields.name}
        Evfolyam: ${request.fields.year}
        Kurzusok szama: ${request.fields.course}
        Szeminariumok szama: ${request.fields.seminar}
        Laborok szama: ${request.fields.lab}
        `;

      console.log(respBody);
      response.set('Content-Type', 'text/plain;charset=utf-8');
      response.end(respBody);
    } else {
      const respBody = `Hiba: Az adott tantargy mar letezik!
        `;
      console.log(respBody);
      response.set('Content-Type', 'text/plain;charset=utf-8');
      response.end(respBody);
    }
  }
});

app.post('/submit_form_diak', (request, response) => {
  const { subject } = request.fields.subject;
  const { studentID } = request.fields.studentID;
  if (subject === '' || studentID === '') {
    const respBody = `Hibas bemeneti adatok!
    `;
    console.log(respBody);
    response.set('Content-Type', 'text/plain;charset=utf-8');
    response.writeHead(406);
    response.end(respBody);
  } else {
    let respBody = '';
    if (!(subject in subjects)) {
      respBody = 'Hiba: Az adott tantargy nem letezik!';
    } else {
      const { connection } = request.fields.connection;
      if (connection === 'join') {
        if (!([studentID, subject] in students) || students[[studentID, subject]] === false) {
          students[[studentID, subject]] = true;
          respBody = `A tantargyhoz valo csatlakozas sikereses!
                Diak ID: ${studentID}
                Tantargy kodja:  ${subject}
                `;
        } else {
          respBody = ` ${studentID} mar csatlakozott a ${subject} tantargyhoz!
                `;
        }
      } else if (students[[studentID, subject]] === true) {
        students[[studentID, subject]] = false;
        respBody = `A tantargybol valo kilepes sikereses!
                Diak ID: ${studentID}
                Tantargy kodja:  ${subject}
                `;
      } else {
        respBody = `${studentID} mar kilepett a ${subject} tantargybol!
                `;
      }
    }
    console.log(respBody);
    response.set('Content-Type', 'text/plain;charset=utf-8');
    response.end(respBody);
  }
});

app.post('/submit_form_allomany', (request, response) => {
  const file = request.files.myfile;
  const { subjectID } = request.fields.subjectID;
  if (file === '' || subjectID === '') {
    const respBody = `Hibas bemeneti adatok!
    `;
    console.log(respBody);
    response.set('Content-Type', 'text/plain;charset=utf-8');
    response.writeHead(406);
    response.end(respBody);
  } else {
    let respBody = '';
    if (!(subjectID in subjects)) {
      respBody = `Hiba: Az adott tantargy nem letezik!
        `;
    } else {
      respBody = `A szerver sikeresen megkapta a következő információt:
        Tantargy kodja:  ${subjectID}
        Állomány: ${file.name}
        `;
      files[[subjectID, file.name]] = true;
    }
    console.log(respBody);
    response.set('Content-Type', 'text/plain;charset=utf-8');
    response.end(respBody);
  }
});

app.listen(8080, () => { console.log('Server listening on http://localhost:8080/ ...'); });
