'use strict'

const app = require('./app');
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Connection to the server established, listening on port: ${PORT}`);
})