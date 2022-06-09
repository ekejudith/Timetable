import dbConnection from './connection.js';

export const insertFileOfSubject = (subjectID, filePath, fileName) => {
  const query = 'Insert into FilesOfSubject(subjectID, filePath, fileName) values(?,?,?);';
  return dbConnection.executeQuery(query, [subjectID, filePath, fileName]);
};

export const isFileOfSubject = async (subject, file) => {
  const query = 'select * from FilesOfSubject where subjectID = ? and fileName = ? ;';
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

export const getFilesOfSubject = (subjectID) => {
  const query = 'Select * from FilesOfSubject where subjectID = ? ';
  return dbConnection.executeQuery(query, [subjectID]);
};

export const deleteFileOfSubject = (id) => {
  const query = 'Delete from FilesOfSubject where id = ?';
  return dbConnection.executeQuery(query, [id]);
};
