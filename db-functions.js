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
  return output;
}

const createAnswersTable = async() => {
  output = await query(`CREATE TABLE IF NOT EXISTS answers (
    id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    question_id int(11) NOT NULL,
    answer varchar(255) NOT NULL,
    is_correct tinyint(1) NOT NULL
    );`);
  return output;
}

const insertQuestionsDef = async() => {
  let sqlQuery = await readFile('./sql-cmds/values-questions.sql');
  output = await query(sqlQuery);
  return output;
}

const insertAnswersDef = async() => {
  let sqlQuery = await readFile('./sql-cmds/values-answers.sql');
  output = await query(sqlQuery);
  return output;
}

const numberOfQuestions = async() => {
  let output = await query(`SELECT COUNT(*) FROM questions`);
  return Object.values(output[0])[0];
}

const chooseRandomQ = async() => {
  let numberOfQ = await numberOfQuestions();
  output = await query(`SELECT question_id, question, answer, is_correct FROM questions 
    RIGHT JOIN answers ON (questions.id = answers.question_id)
    WHERE question_id = ?;`,[Math.ceil(Math.random() * numberOfQ)]);
  return output;
}

module.exports = {
  initTables,
  chooseRandomQ
}