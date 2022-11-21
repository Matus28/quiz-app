'use strict';

const express = require('express');
const app = express();
const dbMethods = require('./db-functions');

app.use(express.json());
app.use(express.static('public'));

app.get('/game', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/game', (req, res) => {
  try {
    dbMethods.initTables();
    dbMethods.chooseRandomQ()
    .then(data => {
      res.status(200).json(data);
    })
  } catch(err) {
    console.log(err);
  }
  
})

module.exports = app;