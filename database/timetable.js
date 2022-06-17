import dbConnection from './connection.js';

export const getTimetable = async () => {
  const query = `Select t.day, t.hour, t.subgroupID, t.type, 
  t.subjectID, s.subjectName, teacherID, u.name from Timetable as t
  join Subjects as s on s.subjectID = t.subjectID 
  join Users as u on u.userID = t.teacherID 
  join DaysOfWeek as d on d.dayName = t.day
  order by d.dayID; `;
  return dbConnection.executeQuery(query);
};

export const getTimetableOfSubgroup = async (subgroupID) => {
  const query = `Select t.day, t.hour, t.subgroupID, t.type, 
  t.subjectID, s.subjectName, teacherID, u.name from Timetable as t
  join Subjects as s on s.subjectID = t.subjectID 
  join Users as u on u.userID = t.teacherID 
  join StudentGroups as sg on sg.subgroupID=t.subgroupID
  join DaysOfWeek as d on d.dayName = t.day
  where sg.subgroupID = ?
  or sg.subgroupID = (select groupID from StudentGroups where subgroupID = ? )
  order by d.dayID; `;
  return dbConnection.executeQuery(query, [subgroupID, subgroupID]);
};

export const getTimetableOfGroup = async (groupID) => {
  const query = `Select t.day, t.hour, t.subgroupID, t.type, 
        t.subjectID, s.subjectName, teacherID, u.name from Timetable as t
        join Subjects as s on s.subjectID = t.subjectID 
        join Users as u on u.userID = t.teacherID 
        join StudentGroups as sg on sg.subgroupID=t.subgroupID
        join DaysOfWeek as d on d.dayName = t.day
        where sg.groupID = ?
        order by d.dayID; `;
  return dbConnection.executeQuery(query, [groupID]);
};

export const getTimetableOfTeacher = async (userID) => {
  const query = `Select t.day, t.hour, t.subgroupID, t.type, 
        t.subjectID, s.subjectName, teacherID, u.name from Timetable as t
        join Subjects as s on s.subjectID = t.subjectID 
        join Users as u on u.userID = t.teacherID 
        join DaysOfWeek as d on d.dayName = t.day
        where  u.userID = ? 
        order by d.dayID;
        `;
  return dbConnection.executeQuery(query, [userID]);
};

export const getTimetableOfSubject = async (subejctID) => {
  const query = `Select t.day, t.hour, t.subgroupID, t.type, 
        t.subjectID, s.subjectName, teacherID, u.name from Timetable as t
        join Subjects as s on s.subjectID = t.subjectID 
        join Users as u on u.userID = t.teacherID 
        join DaysOfWeek as d on d.dayName = t.day
        where s.subjectID = ? 
        order by d.dayID;`;
  return dbConnection.executeQuery(query, [subejctID]);
};

export const insertIntoTimetable = async (params) => {
  console.log(params);
  const query = 'insert into Timetable values(?,?,?,?,?,?);';
  return dbConnection.executeQuery(query, [params.day, params.hour,
    params.year, params.type, params.subject, params.teacher]);
};

export const deleteFromTimetable = async (params) => {
  console.log(params);
  const query = ` delete from Timetable 
    WHERE day = ? and hour = ? and subgroupID = ? and type = ? and subjectID = ? and teacherID = ? ;`;
  return dbConnection.executeQuery(query, [params.day, params.hour,
    params.year, params.type, params.subject, params.teacher]);
};
