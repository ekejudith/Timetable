import dbConnection from './connection.js';

export const createTables = async () => {
  try {
    await dbConnection.executeQuery(`create table if not exists Students
    ( 
    studentID varchar(10),
    studentName varchar(255),
    primary key(studentID)
    );`);

    await dbConnection.executeQuery(`create table if not exists Subjects
    ( 
    subjectID varchar(10),
    subjectName varchar(255),
    year varchar(10),
    numberOfCourses int,
    numberOfSeminars int,
    numberOfLabs int,
    primary key(subjectID)
    ) ;`);

    await dbConnection.executeQuery(`create table if not exists FilesOfSubject
    (
    subjectID varchar(10),
    fileName varchar(255),
    primary key(subjectID,fileName),
    foreign key(subjectID) references Subjects(subjectID)
    );`);

    await dbConnection.executeQuery(`create table if not exists SubjectsOfStudent
    (
    subjectID varchar(10),
    studentID varchar(10),
    primary key(subjectID,studentID),
    foreign key(subjectID) references Subjects(subjectID),
    foreign key(studentID) references Students(studentID)
    );`);

    console.log('Tables created successfully');
  } catch (err) {
    console.error(`Create table error: ${err}`);
    process.exit(1);
  }
};

export const insertStudent = (student) => {
  const query = 'Insert into Students values(?, ?);';
  return dbConnection.executeQuery(query, [student.studentID, student.studentName]);
};

export const insertSubject = (subject) => {
  const query = 'Insert into Subjects values(?, ?, ?, ?, ?, ? );';
  return dbConnection.executeQuery(query, [subject.subjectID, subject.subjectName, subject.year,
    subject.course, subject.seminar, subject.lab]);
};

export const insertFileOfSubject = (subjectID, file) => {
  const query = 'Insert into FilesOfSubject values(?,?);';
  return dbConnection.executeQuery(query, [subjectID, file]);
};

export const insertSubjectOfStudent = (student) => {
  const query = 'Insert into SubjectsOfStudent values(?, ?);';
  return dbConnection.executeQuery(query, [student.subjectID, student.studentID]);
};

export const isStudent = async (student) => {
  const query = 'select * from students where studentID = ? ;';
  try {
    const value = await dbConnection.executeQuery(query, [student.studentID]);
    if (value.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Query error: ${err}`);
    return false;
  }
};

export const isSubject = async (subject) => {
  const query = 'select * from subjects where subjectID = ? ;';
  try {
    const value = await dbConnection.executeQuery(query, [subject.subjectID]);
    if (value.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Query error: ${err}`);
    return false;
  }
};

export const isSubjectOfStudent = async (subjectOfStudent) => {
  const query = 'select * from SubjectsOfStudent where subjectid = ? and studentID = ? ;';
  try {
    const value = await dbConnection.executeQuery(
      query,
      [subjectOfStudent.subjectID, subjectOfStudent.studentID],
    );
    if (value.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Query error: ${err}`);
    return false;
  }
};

export const isFileOfSubject = async (subject, file) => {
  const query = 'select * from FilesOfSubject where subjectid = ? and fileName = ? ;';
  try {
    const value = await dbConnection.executeQuery(query, [subject.subjectID, file]);
    if (value.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Query error: ${err}`);
    return false;
  }
};

export const deleteSubjectOfStudent = (subjectOfStudent) => {
  const query = `Delete from SubjectsOfStudent 
  where subjectid = ? and studentid = ?;`;
  return dbConnection.executeQuery(query, [subjectOfStudent.subjectID, subjectOfStudent.studentID]);
};

export const getAllSubjects = () => {
  const query = 'Select * from Subjects';
  return dbConnection.executeQuery(query);
};

export const getSubject = (subjectID) => {
  const query = 'Select * from Subjects where subjectid = ?';
  return dbConnection.executeQuery(query, [subjectID]);
};

export const getFilesOfSubject = (subjectID) => {
  const query = 'Select * from FilesOfSubject where subjectid = ? ';
  return dbConnection.executeQuery(query, [subjectID]);
};
