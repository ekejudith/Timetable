import dbConnection from './connection.js';

export const isUser = async (userID, password) => {
  const query = 'Select role from User where userID = ? and password=?';
  try {
    const value = await dbConnection.executeQuery(query, [userID, password]);
    return value[0];
  } catch (err) {
    console.error(`Query error: ${err}`);
    return false;
  }
};

export const insertUser = async (userID, password, role) => {
  const query = 'insert into User values(?,?,?)';
  return dbConnection.executeQuery(query, [userID, password, role]);
};

export const getPassword = async (userID) => {
  const query = 'Select password from User where userID = ?';
  try {
    const value = await dbConnection.executeQuery(query, [userID]);
    return value[0].password;
  } catch (err) {
    console.error(`Query error: ${err}`);
    return false;
  }
};

export const getRole = async (userID) => {
  const query = 'Select role from User where userID = ?';
  try {
    const value = await dbConnection.executeQuery(query, [userID]);
    return value[0].role;
  } catch (err) {
    console.error(`Query error: ${err}`);
    return false;
  }
};
