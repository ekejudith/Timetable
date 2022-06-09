import dbConnection from './connection.js';

export const insertSubject = (subject, userID) => {
  const query = 'Insert into Subjects values(?, ?, ?, ?, ?, ? ,?);';
  return dbConnection.executeQuery(query, [subject.subjectID, subject.subjectName, subject.year,
    subject.course, subject.seminar, subject.lab, userID]);
};

export const insertSubjectOfStudent = (student) => {
  const query = 'Insert into SubjectsOfStudent values(?, ?);';
  return dbConnection.executeQuery(query, [student.subjectID, student.studentID]);
};

export const deleteSubjectOfStudent = (subjectOfStudent) => {
  const query = `Delete from SubjectsOfStudent 
    where subjectID = ? and studentID = ?;`;
  return dbConnection.executeQuery(query, [subjectOfStudent.subjectID, subjectOfStudent.studentID]);
};

export const isSubject = async (subject) => {
  const query = 'select * from Subjects where subjectID = ? ';
  try {
    const value = await dbConnection.executeQuery(query, [subject]);
    if (value.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Query error: ${err}`);
    return false;
  }
};

export const isSubjectOfStudent = async (subjectID, studentID) => {
  const query = 'select * from SubjectsOfStudent where subjectID = ? and studentID = ? ;';
  try {
    const value = await dbConnection.executeQuery(
      query,
      [subjectID, studentID],
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

export const getAllSubjects = async () => {
  const query = 'Select * from Subjects';
  return dbConnection.executeQuery(query);
};

export const getSubjectsOfUser = async (userID) => {
  const query = 'Select * from Subjects where userID = ?';
  return dbConnection.executeQuery(query, [userID]);
};

export const getSubject = async (subjectID) => {
  const query = 'Select * from Subjects where subjectID = ?';
  try {
    const value = await dbConnection.executeQuery(query, [subjectID]);
    return value[0];
  } catch (err) {
    console.error(`Query error: ${err}`);
    return false;
  }
};

export const updateUserOfSubject = async (subjectID, userID) => {
  const query = 'Update Subjects set userID = ? WHERE subjectID = ?';
  return dbConnection.executeQuery(query, [userID, subjectID]);
};

export const getUserOfSubject = async (subjectID) => {
  const query = `Select name from Subjects 
  join Users on Users.userID = Subjects.userID
  where subjectID = ?`;
  try {
    const value = await dbConnection.executeQuery(query, [subjectID]);
    return value[0].name;
  } catch (err) {
    console.error(`Query error: ${err}`);
    return false;
  }
};
