'use strict';

const express = require('express');
const app = express();
const dbMethods = require('./db-functions');

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/home', (req, res) => {
  let output = dbMethods.initTables();
  res.status(200).json(output)
})

module.exports = app;