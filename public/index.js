'use strict'

// INIT
const question = document.getElementsByClassName('question-box')[0];
const answer = document.getElementsByClassName('answers-box')[0];
const url = 'http://localhost:3000';
let options = {
  method: 'GET',
  headers: {'Content-Type': 'application/json'}
}

// REQuest questions from server
const requestQuestion = async(url, options) => {
  try {
    let response = await fetch(url, options);
    if(response.status !== 200) throw new Error (`Couldn't establish connection with api: ${url}`);
    let data = await response.json();
    return await createButtons(data);
  } catch(err) {
    console.log(err);
    return;
  }
}

// Create buttons + question
const createButtons = (data) => {
  return new Promise((resolve, reject) => {
    updateScore();
    document.getElementsByClassName('question-box')[0].innerHTML = '';
    document.getElementsByClassName('answers-box')[0].innerHTML = '';
    const dataAnswers = data.answers;
    const questionH = document.createElement('h2');
    questionH.textContent = data.question;
    question.appendChild(questionH);
  
    for (let i = 0; i < 4; i++) {
      let answerDiv = document.createElement('button');
      answerDiv.setAttribute('id', dataAnswers[i][0].id);
      answerDiv.textContent = dataAnswers[i][0][`answer_${i + 1}`];
      answerDiv.setAttribute('data-correct', dataAnswers[i][0].is_correct);
      answerDiv.setAttribute('class', 'answer not-selected');
      answer.appendChild(answerDiv);
    }
    return resolve(document.querySelectorAll('button'));
  });
}

// UPDATE actual score 
const updateScore = (method) => {
  let score = parseInt(localStorage.getItem('score'));
  
  if (method === 'add') {
    score = score + 1;
  } else if (method === 'restart') {
    score = 0;
  }
  localStorage.setItem('score', score);
  
  const scoreHeader = document.getElementById('score');
  scoreHeader.textContent = `SCORE: ${localStorage.getItem('score')}`;
}

// RESULT of choice
const evaluateChoice = (button, buttons) => {
  button.classList.remove('not-selected');
  button.classList.add('selected');
  if(button.getAttribute('data-correct') === '1') {
    updateScore('add')
  } else if(button.getAttribute('data-correct') === '0') {
    buttons.forEach((bttn) => {
      if(bttn.getAttribute('data-correct') === '1'){
        bttn.classList.remove('not-selected');
        bttn.classList.add('selected');
      }
    })
  }
  buttons.forEach((button) => {
    button.setAttribute('disabled', 'disabled')
  }) 
}

// MAIN Loop --> running quiz in loop
const mainLoop = async() => {
  const buttons = await requestQuestion(url + '/api/game', options);
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
    evaluateChoice(button, buttons);
    setTimeout(mainLoop, 3000);
    });
  });
}

// EVENT Listeners
window.addEventListener('DOMContentLoaded', async (event) => {
  localStorage.setItem('score', 0);
  mainLoop();
});