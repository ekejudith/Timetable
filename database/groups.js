import dbConnection from './connection.js';

export const getAllGroups = async () => {
  const query = 'Select distinct groupID from StudentGroups ';
  return dbConnection.executeQuery(query);
};

export const getAllSubgroups = async () => {
  const query = 'Select distinct subgroupID from StudentGroups ';
  return dbConnection.executeQuery(query);
};

export const isGroup = async (groupID) => {
  const query = 'select * from StudentGroups where groupID = ? ';
  try {
    const value = await dbConnection.executeQuery(query, [groupID]);
    if (value.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Query error: ${err}`);
    return false;
  }
};

export const isSubGroup = async (subgroupID) => {
  const query = 'select * from StudentGroups where subgroupID = ? ';
  try {
    const value = await dbConnection.executeQuery(query, [subgroupID]);
    if (value.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Query error: ${err}`);
    return false;
  }
};
