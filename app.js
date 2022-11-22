'use strict';

const express = require('express');
const app = express();
const dbMethods = require('./db-functions');

app.use(express.json());
app.use(express.static('public'));

app.get('/game', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/questions', (req, res) => {
  res.sendFile(__dirname + '/public/manage.html');
});

app.get('/api/game', (req, res) => {
  try {
    dbMethods.chooseRandomQ()
    .then(data => {
      res.status(200).json(data[0]);
    })
  } catch(err) {
    console.log(err);
  }
})

app.get('/api/questions', (req, res) => {
  try {
    dbMethods.showQuestions()
    .then(data => {
      res.status(200).json(data);
    })
  } catch(err) {
    console.log(err);
  }
})

app.post('/api/questions', (req, res) => {
  try {
    dbMethods.addQuestion(req.body)
    .then(data => {
      res.status(data);
    })
  } catch(err) {
    console.log(err);
  }
})

app.delete('/api/questions/:id', (req, res) => {

    dbMethods.deleteQuestion(req.params.id)
    .then(data => {
      console.log(data);
      res.sendStatus(data);
    }).catch(err => {
      console.log(err);
    });


  // try {
  //   dbMethods.deleteQuestion(req.params.id)
  //   .then(data => {
  //     res.status(200);
  //   })
  // } catch(err) {
  //   console.log(err);
  //   return;
  // }
})

module.exports = app;