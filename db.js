'use strict'

const mysql = require('mysql')
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'quizzApp'
});

function query(sqlQuery, arrayOfValues) {
  return new Promise((resolve, reject) => {
    conn.query(sqlQuery, arrayOfValues, (err, rows) => {
      if(err) {
        console.log(err);
        reject(`Database error!`);
      }
      rows.message = 'success';
      return resolve(rows);
    });
  });
}

module.exports = query;