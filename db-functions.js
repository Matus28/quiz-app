'use strict'

// Module require
const query = require('./db');
const readFile = require('./readfile')
let output;

// INIT of tables
const initTables = async() => {
  let exist = await checkExistTable();
  let tablesStatusOK = true;

  if (exist[0].length === 0) {
    let createdQTable = await createQuestionsTable();
    let filledQTable = await insertQuestionsDef();
    if (createdQTable.message !== "success" || filledQTable.message !== "success") {
      tablesStatusOK = false;
    }
  }
  if (exist[1].length === 0) {
    let createdATable = await createAnswersTable();
    let filledATable = await insertAnswersDef();
    if (createdATable.message !== "success" || filledATable.message !== "success") {
      tablesStatusOK = false;
    }
  }
  return tablesStatusOK;    
}

// Checking if tables exist
const checkExistTable = async() => {
  output = [[],[]]
  output[0] = await query(`SHOW TABLES LIKE "questions";`);
  output[1] = await query(`SHOW TABLES LIKE "answers";`);
  return output;
}

// CREATE questions table
const createQuestionsTable = async() => {
  output = await query(`CREATE TABLE IF NOT EXISTS questions (
    id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    question varchar(255) NOT NULL
    );`);
  return output;
}

// CREATE answers table
const createAnswersTable = async() => {
  output = await query(`CREATE TABLE IF NOT EXISTS answers (
    id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    question_id int(11) NOT NULL,
    answer varchar(255) NOT NULL,
    is_correct tinyint(1) NOT NULL
    );`);
  return output;
}

// FILL questions table with default questions
const insertQuestionsDef = async() => {
  let sqlQuery = await readFile('./sql-cmds/values-questions.sql');
  output = await query(sqlQuery);
  return output;
}

// FILL answers table with default answers
const insertAnswersDef = async() => {
  let sqlQuery = await readFile('./sql-cmds/values-answers.sql');
  output = await query(sqlQuery);
  return output;
}

// COUNTing number of questions
const numberOfQuestions = async() => {
  output = await query(`SELECT COUNT(*) FROM questions`);
  return Object.values(output[0])[0];
}

// Selecting random question
const chooseRandomQ = async() => {
  let tableCreated = await initTables();
  let numberOfQ = await numberOfQuestions();
  let idRandom = Math.ceil(Math.random() * numberOfQ);
  let dataQuestion = await query(`SELECT id, question FROM questions WHERE id = ?;`,[idRandom]);
  let counter = 0;
  console.log(numberOfQ);
  dataQuestion[0].answers = []
  
  for (let i = 4 * idRandom - 3; i <= 4 * idRandom; i++) {
    counter++;
    let dataAnswer = await query(`SELECT question_id, id, answer, is_correct FROM answers WHERE question_id = ? AND id = ?`, [idRandom, i]);
    delete Object.assign(dataAnswer[0], {[`answer_${counter}`]: dataAnswer[0]['answer'] })['answer'];
    dataQuestion[0].answers.push(dataAnswer)
  }
  
  return await dataQuestion;
}

// Showing all questions
const showQuestions = async() => {
  output = await query(`SELECT id, question FROM questions`);
  return output;
}

// ADDing new question
const addQuestion = async (data) => {
  let outputQuestion = await query(`INSERT INTO questions (question) VALUES (?)`, [data.question]);
  console.log(data["answers"])
  for (let i = 0; i < 4; i++) {
    let outputAnswers = await query(`INSERT INTO answers (question_id, answer, is_correct) VALUES (?, ?, ?)`, [outputQuestion.insertId, data["answers"][i][`answer_${i + 1}`], data["answers"][i]["is_correct"]]);
  }
  return 200;
}

const deleteQuestion = async (id) => {
  output = await query(`DELETE FROM questions WHERE id = ?`, [id]);
  if(output.message === 'success') {
    output = await query(`DELETE FROM answers WHERE question_id = ?`, [id]);
  }

  return (output.message === "success") ? 200 : 400;
}

// Exporting functions as module
module.exports = {
  initTables,
  chooseRandomQ,
  showQuestions,
  addQuestion,
  deleteQuestion
}