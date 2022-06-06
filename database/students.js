import dbConnection from './connection.js';

export const insertStudent = (student) => {
  const query = 'Insert into Students values(?, ?);';
  return dbConnection.executeQuery(query, [student.studentID, student.studentName]);
};

export const isStudent = async (student) => {
  const query = 'select * from Students where studentID = ? ;';
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

export const getAllStudents = () => {
  const query = 'Select * from Students';
  return dbConnection.executeQuery(query);
};
