import mysql from 'mysql2';
import autoBind from 'auto-bind';

export class DbConnection {
  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 20,
      database: 'timetable',
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'mysql',
    });

    autoBind(this);
  }

  executeQuery(query, options = []) {
    return new Promise((resolve, reject) => {
      this.pool.execute(query, options, (error, results) => {
        if (error) {
          reject(new Error(`Error while running '${query}: ${error}'`));
        }
        resolve(results);
      });
    });
  }
}

export const createTables = async () => {
  const dbConnection = new DbConnection();
  try {
    await dbConnection.executeQuery(`
    create table if not exists Students ( 
      studentID varchar(10),
      studentName varchar(255),
      primary key(studentID) ); `);

    await dbConnection.executeQuery(`
    create table if not exists Users (
      userID varchar(255),
      name varchar(255),
      password varchar(255),
      role varchar(10) not null check(role in('user','admin')),
      primary key(userID) );`);

    await dbConnection.executeQuery(`
    create table if not exists Subjects ( 
      subjectID varchar(10),
      subjectName varchar(255),
      year varchar(10),
      numberOfCourses int,
      numberOfSeminars int,
      numberOfLabs int,
      userID varchar(255),
      primary key(subjectID),
      foreign key(userID) references Users(userID) ) ;`);

    await dbConnection.executeQuery(`
    create table if not exists FilesOfSubject (
      id int AUTO_INCREMENT,
      subjectID varchar(10),
      filePath varchar(255),
      fileName varchar(255),
      primary key(id),
      foreign key(subjectID) references Subjects(subjectID) );`);

    await dbConnection.executeQuery(`
    create table if not exists SubjectsOfStudent (
      subjectID varchar(10),
      studentID varchar(10),
      primary key(subjectID,studentID),
      foreign key(subjectID) references Subjects(subjectID),
      foreign key(studentID) references Students(studentID) );`);

    await dbConnection.executeQuery(`
    create table if not exists StudentGroups (
      groupID varchar(10),
      subgroupID varchar(10),
      primary key(subgroupID) );`);

    await dbConnection.executeQuery(`
    create table if not exists Timetable (
      day varchar(50),
      hour varchar(50),
      subgroupiD varchar(10),
      type varchar(50),
      subjectID varchar(10),
      teacherID varchar(255),
      primary key(day, hour, teacherID),
      foreign key(subjectID) references Subjects(subjectID),
      foreign key(teacherID) references Users(userID),
      foreign key(subgroupiD) references StudentGroups(subgroupiD) );`);

    console.log('Tables created successfully!');
  } catch (err) {
    console.error(`Create table error: ${err}`);
    process.exit(1);
  }
};

export const insertIntoTables = async () => {
  const dbConnection = new DbConnection();
  try {
    await dbConnection.executeQuery(`
    create table if not exists Wishes (
      day varchar(50),
      hour varchar(50),
      subgroupiD varchar(10),
      type varchar(50),
      subjectID varchar(10),
      teacherID varchar(255),
      method varchar(100) not null check(method in('insert','delete')),
      status varchar(100) check(status in('pending','approved','rejected')),
      primary key(day, hour, teacherID, method),
      foreign key(subjectID) references Subjects(subjectID),
      foreign key(teacherID) references Users(userID),
      foreign key(subgroupiD) references StudentGroups(subgroupiD) );`);

    await dbConnection.executeQuery(' drop table if exists DaysOfWeek; ');

    await dbConnection.executeQuery(`
        create table DaysOfWeek (
        dayID int AUTO_INCREMENT primary key,
        dayName varchar(50) );`);

    await dbConnection.executeQuery(`
      insert into DaysOfWeek(dayName) values('Hétfő'), ('Kedd'), ('Szerda'), ('Csütörtök'), ('Péntek'), ('Szombat');`);

    console.log('Inserted data successfully!');
  } catch (err) {
    console.error(`Insert into table error: ${err}`);
    process.exit(1);
  }
};

createTables().then(insertIntoTables).catch((err) => {
  console.error(err);
});

export default new DbConnection();
