import dbConnection from './connection.js';

export const getAllWishes = async () => {
  const query = `Select t.day, t.hour, t.subgroupID, t.type, 
  t.subjectID, s.subjectName, teacherID, u.name, t.method, t.status from Wishes as t
  join Subjects as s on s.subjectID = t.subjectID 
  join Users as u on u.userID = t.teacherID 
  join DaysOfWeek as d on d.dayName = t.day
  where t.status = 'pending'
  order by u.name; `;
  return dbConnection.executeQuery(query, []);
};

export const getWishesOfTeacher = async (userID) => {
  const query = `Select t.day, t.hour, t.subgroupID, t.type, 
        t.subjectID, s.subjectName, teacherID, u.name, t.method, t.status from Wishes as t
        join Subjects as s on s.subjectID = t.subjectID 
        join Users as u on u.userID = t.teacherID 
        join DaysOfWeek as d on d.dayName = t.day
        where u.userID = ? 
        order by d.dayID;
        `;
  return dbConnection.executeQuery(query, [userID]);
};

export const insertIntoWishes = async (params, method, status) => {
  const query = 'insert into Wishes values(?,?,?,?,?,?,?,?);';
  return dbConnection.executeQuery(query, [params.day, params.hour,
    params.year, params.type, params.subject, params.teacher, method, status]);
};
export const updateWishes = async (params, status) => {
  const query = `update Wishes 
    set status = ? 
    where day = ?
    and hour = ?
    and subgroupID = ?
    and type = ?
    and subjectID = ?
    and teacherID = ?
    and method = ? `;
  return dbConnection.executeQuery(query, [status, params.day, params.hour,
    params.year, params.type, params.subject, params.teacher, params.method]);
};
