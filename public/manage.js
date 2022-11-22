'use strict'

const manageQ = document.getElementsByClassName('manage-question')[0];
const createQ = document.getElementsByClassName('create-question')[0];
const form = document.getElementsByTagName('form')[0];
const url = 'http://localhost:3000/api/questions';
let options = {
  method: 'POST',
  headers: {'Content-Type': 'application/json'}
}


// MAIN Loop --> running quiz in loop
const mainLoop = async() => {
  
}


const evaluateForm = async (form) => {
  const radioInp = document.querySelectorAll('input[name="correct-answer"]');
  let data = {
    "question": form.question.value,
    "answers": [
      {
        "answer_1": form.answer1.value,
        "is_correct": (radioInp[0].checked) ? 1: 0
      },
      {
        "answer_2": form.answer2.value,
        "is_correct": (radioInp[1].checked) ? 1: 0
      },
      {
        "answer_3": form.answer3.value,
        "is_correct": (radioInp[2].checked) ? 1: 0
      },
      {
        "answer_4": form.answer4.value,
        "is_correct": (radioInp[3].checked) ? 1: 0
      },
    ]
  }

  return await data;
}

const getQuestions = async (url, options) => {
  options.method = 'GET';
  delete options.method;

  try {
    let response = await fetch(url, options);
    if(response.status !== 200) throw new Error (`Couldn't establish connection with api: ${url}`);
    let data = await response.json();
    return data;
  } catch(err) {
    console.log(err);
    return;
  }
}

const updateQuestions = async (url, options) => {
  let data = await getQuestions(url, options);
  
  manageQ.innerHTML = '';
  for (let i = 0; i < data.length; i++) {
    const questionDiv = document.createElement('div');
    questionDiv.setAttribute('class', 'question-unit');
    manageQ.appendChild(questionDiv);
    const questionP = document.createElement('p');
    questionP.textContent = data[i]["question"];
    questionDiv.appendChild(questionP);
    const questionB = document.createElement('button');
    questionB.textContent = "delete";
    questionDiv.appendChild(questionB);
  }

}

const sendData = async (url, options, data) => {
  options.method = 'POST';
  options.body = JSON.stringify(data);

  try {
    let response = await fetch(url, options);
    if(response.status !== 200) throw new Error (`Couldn't establish connection with api: ${url}`);
    return true;
  } catch(err) {
    console.log(err);
    return false;
  }
}

// EVENT Listeners
window.addEventListener('DOMContentLoaded', async (event) => {
  updateQuestions(url, options);
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  let dataToSend = await evaluateForm(form);
  let result = await sendData(url, options, dataToSend);
  updateQuestions(url, options);

})