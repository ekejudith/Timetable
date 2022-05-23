import mysql from 'mysql2';
import autoBind from 'auto-bind';

export class DbConnection {
  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
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
    id int AUTO_INCREMENT,
    subjectID varchar(10),
    filePath varchar(255),
    fileName varchar(255),
    primary key(id),
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

createTables().catch((err) => {
  console.error(err);
});

export default new DbConnection();
