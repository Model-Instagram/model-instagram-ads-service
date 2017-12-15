const express = require('express');
const db = require('../database/seed.js');
// const { seedAllData } = require('../database/seed.js');

const app = express();

// seedAllData();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(8080, () => console.log('Interactions server is listening on port 8080!'));
