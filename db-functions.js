'use strict'

const query = require('./db');
const readFile = require('./readfile')
let output;

const initTables = async() => {
  let exist = await checkExistTable();
  if (exist[0].length === 0) {
    createQuestionsTable();
    insertQuestionsDef();
  }
  if (exist[1].length === 0) {
    createAnswersTable();
    insertAnswersDef();
  }
}

const checkExistTable = async() => {
  output = [[],[]]
  output[0] = await query(`SHOW TABLES LIKE "questions";`);
  output[1] = await query(`SHOW TABLES LIKE "answers";`);

  return output;
}

const createQuestionsTable = async() => {
  output = await query(`CREATE TABLE IF NOT EXISTS questions (
    id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    question varchar(255) NOT NULL
    );`);
  return await output;
}

const createAnswersTable = async() => {
  output = await query(`CREATE TABLE IF NOT EXISTS answers (
    id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    question_id int(11) NOT NULL,
    answer varchar(255) NOT NULL,
    is_correct tinyint(1) NOT NULL
    );`);
  return await output;
}

const insertQuestionsDef = async() => {
  let sqlQuery = await readFile('./sql-cmds/values-questions.sql');
  output = await query(sqlQuery);
  return await output;
}

const insertAnswersDef = async() => {
  let sqlQuery = await readFile('./sql-cmds/values-answers.sql');
  output = await query(sqlQuery);
  return await output;
}

module.exports = {
  initTables
}