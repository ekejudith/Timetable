import dbConnection from './connection.js';

export const isUser = async (userID, password) => {
  const query = 'Select role from Users where userID = ? and password=?';
  try {
    const value = await dbConnection.executeQuery(query, [userID, password]);
    return value[0];
  } catch (err) {
    console.error(`Query error: ${err}`);
    return false;
  }
};

export const isTeacher = async (userID) => {
  const query = 'Select role from Users where userID = ? and role="user" ';
  try {
    const value = await dbConnection.executeQuery(query, [userID]);
    if (value.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Query error: ${err}`);
    return false;
  }
};

export const insertUser = async (userID, userName, password, role) => {
  const query = 'insert into Users values(?,?,?,?)';
  return dbConnection.executeQuery(query, [userID, userName, password, role]);
};

export const getPassword = async (userID) => {
  const query = 'Select password from Users where userID = ?';
  try {
    const value = await dbConnection.executeQuery(query, [userID]);
    return value[0].password;
  } catch (err) {
    console.error(`Query error: ${err}`);
    return false;
  }
};

export const getRole = async (userID) => {
  const query = 'Select role from Users where userID = ?';
  try {
    const value = await dbConnection.executeQuery(query, [userID]);
    return value[0].role;
  } catch (err) {
    console.error(`Query error: ${err}`);
    return false;
  }
};

export const getUser = async (userID) => {
  const query = 'Select role from Users where userID = ?';
  try {
    const value = await dbConnection.executeQuery(query, [userID]);
    return value[0];
  } catch (err) {
    console.error(`Query error: ${err}`);
    return false;
  }
};

export const getAllTeachers = async () => {
  const query = 'select * from Users where role = "user" order by name';
  return dbConnection.executeQuery(query);
};
