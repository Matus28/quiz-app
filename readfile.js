'use strict'

const fs = require('fs');

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    let data ='';
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err);
        reject('Could not read the file.');
        return;
      }
      return resolve(data.toString());
    })
  }); 
}

module.exports = readFile;