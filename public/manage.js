'use strict'

const manageQ = document.getElementsByClassName('manage-question')[0];
const createQ = document.getElementsByClassName('create-question')[0];
const form = document.getElementsByTagName('form')[0];
const url = 'http://localhost:3000/api/questions';
let options = {
  method: 'POST',
  headers: {'Content-Type': 'application/json'}
}

// UPDATE Question-div section (WHERE are questions appended)
const updateQuestions = async() => {
  let dataQuestions = await getQuestions(url, options);
  createQuestionArticles(dataQuestions);
}

// GET questions from DB
const getQuestions = async (url, options) => {
  options.method = 'GET';
  delete options.body;

  try {
    let response = await fetch(url, options);
    if(response.status !== 200) throw new Error (`Couldn't establish connection with api: ${url}`);
    let data = await response.json();
    return data;  // --> returning all Questions from DB
  } catch(err) {
    console.log(err);
    return;
  }
}

const createQuestionArticles = (data) => {
  manageQ.innerHTML = '';
  for (let i = 0; i < data.length; i++) {
    const questionDiv = document.createElement('div');
    questionDiv.setAttribute('class', 'question-unit');
    questionDiv.setAttribute('data-id', data[i]["id"]);
    manageQ.appendChild(questionDiv);
    const questionP = document.createElement('p');
    questionP.textContent = data[i]["question"];
    questionDiv.appendChild(questionP);
    const questionB = document.createElement('button');
    questionB.textContent = "delete";
    questionB.addEventListener('click', async (event) => {
      deleteQuestion(url + '/' + data[i]["id"], options, data[i]["id"]);
      updateQuestions();
    })
    questionDiv.appendChild(questionB);
  }
}

// DELETE questions shown on page
const deleteQuestion = async (url, options, id) => {
  options.method = 'DELETE';
  delete options.body;
  
  fetch(url, options)
  .then(response => {
    console.log(response.status)
    if(response.status !== 200) {
      throw new Error (`Couldn't establish connection with api: ${url}`)
    }
    return;
  }).catch((err) => {
    console.log(err);
  })
}

// RECEIVE and process data from FORM
const evaluateForm = (form) => {
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
  return data;
}

// POST data from FORM to backend (server)
const sendData = async (url, options, data) => {
  options.method = 'POST';
  options.body = JSON.stringify(data);

  try {
    let response = await fetch(url, options);
    if(response.status !== 200) throw new Error (`Couldn't establish connection with api: ${url}`);
  } catch(err) {
    console.log(err);
    return;
  }
}

// EVENT Listener - DOM Loaded
window.addEventListener('DOMContentLoaded', async (event) => {
  updateQuestions();
});

// EVENT Listener - Form submitted
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  let dataToSend = await evaluateForm(form);
  sendData(url, options, dataToSend);
  updateQuestions();
})